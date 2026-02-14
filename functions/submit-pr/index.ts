export async function onRequestPost(context) {
    const { request, env } = context;

    // 1. Validate Request
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { printablesUrl, editedPart } = body;
    if (!printablesUrl?.includes('printables.com/model/') || !editedPart?.title) {
        return new Response(JSON.stringify({ error: 'Missing or invalid data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        // 2. Scrape Printables (Server-side)
        let scrapedTitle = '';
        let scrapedImage = '';
        try {
            const res = await fetch(printablesUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PubPartsBot/1.0)' }
            });
            if (res.ok) {
                const html = await res.text();
                const getMeta = (prop) => {
                    const match = html.match(new RegExp(`<meta[^>]*property="${prop}"[^>]*content="([^"]*)"`, 'i'));
                    return match ? match[1].replace(/&quot;/g, '"') : '';
                };
                scrapedTitle = getMeta('og:title');
                scrapedImage = getMeta('og:image');
            }
        } catch (e) {
            console.warn('Scraping failed, falling back to user data', e);
        }

        // 3. Construct Part Object
        const finalPart = {
            title: editedPart.title || scrapedTitle,
            fabricationMethod: editedPart.fabricationMethod || ['3d Printed'],
            typeOfPart: editedPart.typeOfPart || [],
            imageSrc: editedPart.imageSrc || scrapedImage,
            externalUrl: printablesUrl,
            dropboxUrl: editedPart.dropboxUrl || '',
            dropboxZipLastUpdated: editedPart.dropboxZipLastUpdated || new Date().toISOString().split('T')[0],
            platform: editedPart.platform || ['Miscellaneous Items'],
        };

        // 4. GitHub API Configuration
        const token = env.GITHUB_TOKEN;
        if (!token) throw new Error('No GITHUB_TOKEN configured');

        const owner = 'Focerqc';
        const repo = 'CLONEpubparts.xyz';
        const baseBranch = 'master';
        const filePath = 'src/util/parts.ts';
        const apiHeaders = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Cloudflare-Pages-Function' // REQUIRED by GitHub
        };

        // 5. Git Workflow: Get SHA -> Create Branch -> Update File -> PR

        // Get Base SHA
        const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`, { headers: apiHeaders });
        if (!refRes.ok) throw new Error(`Failed to get base SHA: ${refRes.status}`);
        const { object: { sha: baseSha } } = await refRes.json();

        // Create Branch
        const branchName = `add-part-${Date.now()}`;
        const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
        });
        if (!branchRes.ok) throw new Error(`Failed to create branch: ${branchRes.status}`);

        // Get File Content
        const contentRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branchName}`, { headers: apiHeaders });
        if (!contentRes.ok) throw new Error(`Failed to fetch file: ${contentRes.status}`);
        const { content: base64Content, sha: fileSha } = await contentRes.json();

        // Decode (UTF-8 safe)
        const currentContent = decodeURIComponent(escape(atob(base64Content)));

        // Insert New Entry
        // We strictly search for the last closing bracket of the array
        const newEntryString = JSON.stringify(finalPart, null, 2);
        // Regex finds the last bracket "]" possibly followed by semicolon, at the very end of the array structure
        const updatedContent = currentContent.replace(/(\]\s*;?\s*)$/, `, \n${newEntryString}\n$1`);

        // Encode (UTF-8 safe)
        const newBase64Content = btoa(unescape(encodeURIComponent(updatedContent)));

        // Commit File
        const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: apiHeaders,
            body: JSON.stringify({
                message: `Add part: ${finalPart.title}`,
                content: newBase64Content,
                sha: fileSha,
                branch: branchName,
            }),
        });
        if (!commitRes.ok) throw new Error(`Commit failed: ${commitRes.status}`);

        // Open Pull Request
        const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            method: 'POST',
            headers: apiHeaders,
            body: JSON.stringify({
                title: `Add Part: ${finalPart.title}`,
                head: branchName,
                base: baseBranch,
                body: `Auto-submitted via Cloudflare Pages.\nOriginal URL: ${printablesUrl}`,
            }),
        });

        if (!prRes.ok) throw new Error(`PR creation failed: ${prRes.status}`);
        const prData = await prRes.json();

        return new Response(JSON.stringify({ success: true, prUrl: prData.html_url }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}