
const allPartsShopItems = [
    {
        title: "Black anodized CNC PubBox V3.0 with lid, window, and optional parts packs",
        typeOfPart: ["Controller Box"],
        imageSrc: [
            "/images/shop/cnc_pubbox_v3_1.jpg",
            "/images/shop/cnc_pubbox_v3_2.jpg",
            "/images/shop/cnc_pubbox_v3_3.jpg",
            "/images/shop/cnc_pubbox_v3_4.jpg",
            "/images/shop/cnc_pubbox_v3_5.jpg",
            "/images/shop/cnc_pubbox_v3_6.jpg",
            "/images/shop/cnc_pubbox_v3_7.jpg",
            "/images/shop/cnc_pubbox_v3_8.jpg",
            "/images/shop/cnc_pubbox_v3_9.jpg",
            "/images/shop/cnc_pubbox_v3_10.jpg"
        ],
        externalUrl: "/parts/xr?search=CNC%20PubBox%20V3.0",
        platform: ["XR/Funwheel"],
        availableCount: 11,
        description: `
            <p>All parts:</p>
            <ul>
                <li>
                    6061 anodized black pubbox with the change logs:
                    <ul>
                        <li>Angled footpad and battery harness mount points, to help with pushing the battery harness into the rail and to allow more clearance for the footpad connector</li>
                        <li>Threaded battery harness hole, M20. No more inner nut needed, just thread it in.</li>
                        <li>Now, the box has full contact with the rails at both screw points. No more tab spacers needed for the bumpers (which also means bumpers with these tabs will need them removed).</li>
                        <li>23% less lid screws!</li>
                        <li>Built-in mount threaded screw mounts for: Thor300/Thor400/JF6/Mk8/Mk8 Pro/Lfoc/Tronic X12</li>
                        <li>Adapters and plates are available for: Ubox 85v...and more</li>
                    </ul>
                </li>
                <li>6061 anodized black lid</li>
                <li>Acrylic window</li>
            </ul>
            <p>This offering is only for the parts listed above and does not include hardware and printed pieces. If you're interested in those, I'm able to put together packs to include as requested, of the following:</p>
            <ul>
                <li>
                    $15 - Printed Pack
                    <ul>
                        <li>1 x Lid gasket in black TPU</li>
                        <li>1 x Unified cable cover (connector splash guard) in black PETG</li>
                    </ul>
                </li>
            </ul>
            <ul>
                <li>
                    $40 - Hardware Pack
                    <ul>
                        <li>4 x 10-32 3/4" countersunk bolts for rail mounting</li>
                        <li>24 x M3x8 countersunk bolts for lid</li>
                        <li>1 x GX16-4 charge port</li>
                        <li>1 x 19x1 power button with 12V White LED</li>
                        <li>1 x 6 pin footpad switchcraft connector</li>
                        <li>2 x 20mm glands</li>
                        <li>1 x Goretex vent patch</li>
                    </ul>
                </li>
            </ul>
            <p>For a box set with both parts packs, that's $280 total + shipping.</p>
        `,
        condition: "New",
        price: 225,
        featured: true
    },
    {
        title: "20mm Goretex vent patches",
        typeOfPart: ["Miscellaneous"],
        imageSrc: "/images/shop/goretex_patch.png",
        platform: ["Miscellaneous Items"],
        availableCount: 57,
        condition: "New",
        price: 2
    },
    {
        title: "VESC TPU badges (pair)",
        typeOfPart: ["Rail Attachment"],
        imageSrc: "/images/shop/vesc_badge.png",
        externalUrl: "/parts/xr?search=XR%20WTF%20Rail%20Badge",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        condition: "New",
        price: 4
    },
    {
        title: "Used rear XR bumpers",
        typeOfPart: ["Bumper"],
        imageSrc: "/images/shop/xr_bumper_r.png",
        externalUrl: "https://onewheel.com/products/c-bump",
        platform: ["XR/Funwheel"],
        availableCount: 2,
        description: "Plain old stock XR rear bumpers",
        condition: "Used",
        price: 5
    },
    {
        title: "149mm x 12mm x 1.5mm aluminum LED backer plate",
        typeOfPart: ["LED"],
        imageSrc: "/images/shop/led_plate.png",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "Helpful to mount loose LED strips to for use in the box",
        condition: "New",
        price: 10
    },
    {
        title: "Stock XR connector cover",
        typeOfPart: ["Connector Cover"],
        imageSrc: "/images/shop/xr_cover_stock.png",
        externalUrl: "https://onewheel.com/products/xr-cable-cover",
        platform: ["XR/Funwheel"],
        availableCount: 2,
        condition: "Like New",
        price: 10
    },
    {
        title: "CNC PubBox V2 Unified Connector Cover",
        typeOfPart: ["Connector Cover"],
        imageSrc: "/images/shop/unified_cover.png",
        externalUrl: "/parts/xr?search=PubParts:%20CNC%20PubBox%20V2%20XR%20Vesc%20Box%20Unified%20Cable%20Cover",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "",
        condition: "New",
        price: 10
    },
    {
        title: "CNC PubBox V2 Separate Covers (Pair)",
        typeOfPart: ["Connector Cover"],
        imageSrc: "/images/shop/pb_sc.png",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "",
        condition: "Like New",
        price: 10
    },
    {
        title: "Steep & Deep WTF Rail to C&R/FM Fender Adapters",
        typeOfPart: ["Fender"],
        imageSrc: "/images/shop/fender_riser.png",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "",
        condition: "New",
        price: 10
    },
    {
        title: "Standard WTF Rail to C&R/FM Fender Adapters",
        typeOfPart: ["Fender"],
        imageSrc: "/images/shop/fender_riser.png",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "",
        condition: "New",
        price: 10
    },
    {
        title: "FlowGlider Connector Cover",
        typeOfPart: ["Connector Cover"],
        imageSrc: "/images/shop/flowglider.png",
        externalUrl: "/parts/xr?search=FlowGlider:%20Connector%20Cover",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "Printed in PETG",
        condition: "Used",
        price: 10
    },
    {
        title: "XR 4212 BMS with error 16",
        typeOfPart: ["BMS"],
        imageSrc: "/images/shop/xr_bms.png",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "Unknown root cause of the issue - Selling for parts",
        condition: "For Parts",
        price: 20
    },
    {
        title: "XR Stock Rear LED Strip",
        typeOfPart: ["LED"],
        imageSrc: "/images/shop/xr_leds.png",
        externalUrl: "https://onewheel.com/products/xr-battery-side-led-pcb",
        platform: ["XR/Funwheel"],
        availableCount: 2,
        description: "",
        condition: "Like New",
        price: 15
    },
    {
        title: "XR Stock Front LED Strip",
        typeOfPart: ["LED"],
        imageSrc: "/images/shop/xr_leds.png",
        externalUrl: "https://onewheel.com/products/xr-controller-side-led-pcb",
        platform: ["XR/Funwheel"],
        availableCount: 2,
        description: "",
        condition: "Like New",
        price: 15
    },
    {
        title: "XR Float Plates (White)",
        typeOfPart: ["Bumper"],
        imageSrc: "/images/shop/fp_white.png",
        externalUrl: "https://thefloatlife.com/products/v3-float-plates-for-onewheel-xr",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "",
        condition: "Used",
        price: 15
    },
    {
        title: "XR Float Plates (Purple)",
        typeOfPart: ["Bumper"],
        imageSrc: "/images/shop/gp_purple.png",
        externalUrl: "https://thefloatlife.com/products/v3-float-plates-for-onewheel-xr",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "",
        condition: "New",
        price: 30
    },
    {
        title: "Finned Pubhubs Axle Block Covers (Pair)",
        typeOfPart: ["Axle Block"],
        imageSrc: "/images/shop/xr_ab_covers.png",
        externalUrl: "/parts/xr?search=PubHubs:%20XR%20Blocks%20Finned%20Axle%20Block%20Covers",
        platform: ["XR/Funwheel"],
        availableCount: 2,
        description: "",
        condition: "New",
        price: 35
    },
    {
        title: "XR Controller (HW 4212, FW 4165)",
        typeOfPart: ["Controller"],
        imageSrc: "/images/shop/xr_controller.png",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "1115mi, and this controller was pulled from a functional board",
        condition: "Used",
        price: 80
    },
    {
        title: "XR Controller (HW 4212, FW 4155+)",
        typeOfPart: ["Controller"],
        imageSrc: "/images/shop/xr_controller2.png",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "Unknown mileage, but this controller was pulled from a functional board",
        condition: "Used",
        price: 80
    },
    {
        title: "Pint Stock Rear Footpad",
        typeOfPart: ["Footpad"],
        imageSrc: "/images/shop/pint_fp.png",
        platform: ["Pint/X/S"],
        availableCount: 1,
        condition: "New",
        price: 20
    },
    {
        title: "Pint Vega slick tire (New)",
        typeOfPart: ["Tire"],
        platform: ["Pint/X/S"],
        availableCount: 1,
        condition: "New",
        price: 30
    },
    {
        title: "Finned GT Axle Block Covers (Pair)",
        typeOfPart: ["Axle Block Attachment"],
        imageSrc: "/images/shop/gt_ab_covers.png",
        externalUrl: "/parts/gt?search=PubParts:%20GT%20Axle%20Block%20Covers",
        platform: ["GT/GT-S"],
        availableCount: 1,
        description: "Axle block covers for the Onewheel GT frame. Stock fit. These have some sweet cooling fins!",
        condition: "New",
        price: 35
    },
    {
        title: "Onewheel XR Battery Mud Guard",
        typeOfPart: ["Miscellaneous"],
        imageSrc: "https://media.printables.com/media/prints/38cb1740-0a3f-4cfc-977e-e2e5356e4bb5/images/9522319_9670a77b-d078-445c-ac28-28351f342d3e_cd781d75-4983-4b5e-93ed-49d82c4955e8/thumbs/inside/1280x960/png/screenshot_1.webp",
        externalUrl: "/parts/xr?search=Onewheel%20XR%20Battery%20Mud%20Guard",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "Slim battery box mud guard for the Onewheel XR, providing cutouts for the battery harness M20 gland and wires and keeping water and dirt out of your bumpers and battery box edges. Tested with TFL BANG Bumpers and stock bumpers.",
        condition: "New",
        price: 10
    },
    {
        title: "GX-16 Charger Plug w/ Full Cover",
        typeOfPart: ["Port Cover"],
        imageSrc: "https://media.printables.com/media/prints/52be0936-484e-40de-ac8c-e44554264c72/images/9228869_700c1c49-42b5-4e4a-8714-d22da7aecf92_3826ea3d-c58b-4687-9b3f-c4e9891a14a3/thumbs/inside/1280x960/png/screenshot_1.webp",
        externalUrl: "/parts/misc?search=PubParts:%20GX-16%20Charger%20Plug%20with%20Full%20Cover",
        platform: ["Miscellaneous Items"],
        availableCount: -1,
        description: "GX-16 plug full cover with large pull handle",
        condition: "New",
        price: 1
    },
    {
        title: "XR DTF Lift Kit for WTF Extended/BTG",
        typeOfPart: ["Fender"],
        imageSrc: "https://media.printables.com/media/prints/1138681/images/8592011_a22ebc36-5500-4b91-bc6d-25abd7e67a79_c3dfef4f-c5f8-492f-9ba3-55e2a3e1ebaf/thumbs/inside/1280x960/jpg/8799e700-c0af-4686-a63a-aad2cb9b1d7b.webp",
        externalUrl: "/parts/xr?search=PubParts:%20XR%20Drop%20Top%20Lift%20Kit%20for%20WTF%20Extended",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "21mm tall riser for your XR Drop Top Fender, to fit the biggest of tires.",
        condition: "New",
        price: 15
    },
    {
        title: "Z-Hooks: Wedge and Foot Hook w/ Hardware (Front+Rear Set)",
        typeOfPart: ["Footpad Attachment"],
        imageSrc: [
            "/images/shop/zhooks/hooks.png",
            "/images/shop/zhooks/hooks2.png",
            "/images/shop/zhooks/hooks3.png",
            "/images/shop/zhooks/hooks4.png",
            "/images/shop/zhooks/hooks5.png",
            "/images/shop/zhooks/hooks6.png"
        ],
        externalUrl: "/zps/zhooks",
        platform: ["Miscellaneous Items"],
        availableCount: -1,
        condition: "New",
        price: 130,
        featured: true
    },
    {
        title: "1.43in AMOLED Display replacements, for WaveShare 1.43in AMOLED assemblies",
        typeOfPart: ["Display"],
        imageSrc: "/images/shop/amoled_display.png",
        platform: ["VESC Electronics"],
        availableCount: 3,
        description: `
            <p>These are DO0143FMST12 display panels (CO5300/FT3168) from DWO Limited. Their shipping is a flat rate $30, so these were ordered in bulk to save people on shipping. To order yourself would be $36/1, $21/2, $16/3, $14/4, $12/5.</p>
            <p>Or, order them from me for $10 + shipping a piece.</p>
        `,
        condition: "New",
        price: 10
    },
    {
        title: "SF/HC Clamping Blocks (Finned)",
        typeOfPart: ["Axle Block"],
        imageSrc: [
            "/images/shop/clamping_block.png",
            "https://media.printables.com/media/prints/1120000/images/8604014_d459304f-508f-4306-a2aa-7b45fe7a4e47_ad6c7b4e-6e59-45e2-88fb-622ff914f7d4/thumbs/inside/1280x960/png/screenshot_3.webp",
            "https://media.printables.com/media/prints/1120000/images/8791134_d57a2fad-fd68-47ff-a2b3-d778312d505c_3d7440ea-366a-47ef-93ba-2526a2288ea9/thumbs/inside/1280x960/png/screenshot_1.webp",
            "https://media.printables.com/media/prints/1120000/images/8457376_dacfb099-31e0-4f89-a001-7135de39d34e_6cbdc152-b19f-4c59-ba95-79ad92ac2123/thumbs/inside/1280x960/png/screenshot_3.webp"

        ],
        externalUrl: "/parts/xr?search=PubParts:%20Finned%20Clamping%20SuperFlux/HyperCore%20to%20XR%20Rails",
        platform: ["XR/Funwheel"],
        availableCount: 10,
        description: `
            <p>What you'll get:</p>
            <ul>
                <li>2 | Hub bodies (anodized black)</li>
                <li>2 | Hub clamps (anodized black)</li>
                <li>4 | M5 x 35mm black socket cap screws for clamping them together</li>
            </ul>

            <p>What else you'll want:</p>
            <ul>
                <li>A ball end metric hex set</li>
                <li>Axle bolts for mounting your motor</li>
                <li>Rail bolts for mounting to your rail</li>
            </ul>

            <p>These are made from <a target="_blank" href="https://www.printables.com/model/1120000">my remix of Auden's clamping blocks</a> and we've already run a couple batches of them. They're solid, I love the look of them, and they've worked great for hundreds of miles to secure my rails to the axle!</p>
        `,
        condition: "New",
        price: 105,
        featured: true
    },
    {
        title: "Leaf Blaster Pubmote (Full Build)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/techfoundrynz/Pubmote/raw/master/docs/builds/leaf-blaster-assembly.png",
        externalUrl: "https://github.com/techfoundrynz/Pubmote/blob/master/docs/builds/leaf-blaster.md",
        platform: ["VESC Electronics"],
        availableCount: -1,
        description: "Fully build Pubmote based on the Leaf Blaster design.",
        condition: "New",
        price: 120
    },
    {
        title: "Leaf Blaster Pubmote (Parts Kit)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/techfoundrynz/Pubmote/raw/master/docs/builds/leaf-blaster-assembly.png",
        externalUrl: "https://github.com/techfoundrynz/Pubmote/blob/master/docs/builds/leaf-blaster.md",
        platform: ["VESC Electronics"],
        availableCount: -1,
        description: `
            <p>Parts kit for Pubmote based on the Leaf Blaster design. What you'll get:</p>
            <ul>
                <li>1 | ZiNc Leaf Blaster remix case by ZiNc (with heat set inserts, screws)</li>
                <li>1 | WaveShare ESP32-S3 1.43in Amoled Display</li>
                <li>1 | PS5 joystick + cap</li>
                <li>1 | 1500mAh Lipo battery + JST connector for splicing</li>
                <li>6 | 1.25mm JST connectors</li>
                <li>1 | 20k Ohm resistor</li>
                <li>1 | Buzzer</li>
                <li>1 | Black lanyard</li>
            </ul>
            <p>You'll need to do your own soldering, source heat shrink, source wire, and flash firmware to the display - this kit covers the hardware pieces otherwise.</p>
        `,
        condition: "New",
        price: 70
    },
    {
        title: "Snowmote 2 Pubmote (Full Build)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/techfoundrynz/Pubmote/raw/master/docs/builds/snowmote2-assembly.jpg",
        externalUrl: "https://github.com/techfoundrynz/Pubmote/blob/master/docs/builds/snowmote2.md",
        platform: ["VESC Electronics"],
        availableCount: -1,
        description: "Fully build Pubmote based on the Snowmote 2 design.",
        condition: "New",
        price: 120
    },
    {
        title: "Snowmote 2 Pubmote (Parts Kit)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/techfoundrynz/Pubmote/raw/master/docs/builds/snowmote2-assembly.jpg",
        externalUrl: "https://github.com/techfoundrynz/Pubmote/blob/master/docs/builds/snowmote2.md",
        platform: ["VESC Electronics"],
        availableCount: -1,
        description: `
            <p>Parts kit for Pubmote based on the Snowmote 2 design. What you'll get:</p>
            <ul>
                <li>1 | SnowMote 2 case by ZiNc (with screws)</li>
                <li>1 | WaveShare ESP32-S3 1.43in Amoled Display</li>
                <li>1 | PS5 joystick + cap</li>
                <li>1 | 1500mAh Lipo battery + JST connector for splicing</li>
                <li>4 | 1.25mm JST connectors</li>
                <li>1 | 20k Ohm resistor</li>
                <li>1 | Black lanyard</li>
            </ul>
            <p>You'll need to do your own soldering, source heat shrink, source wire, and flash firmware to the display - this kit covers the hardware pieces otherwise.</p>
        `,
        condition: "New",
        price: 70
    },
    {
        title: "CBXR Battery (~1100mi)",
        typeOfPart: ["Battery"],
        imageSrc: "/images/shop/cbxr.png",
        platform: ["VESC Electronics"],
        availableCount: 1,
        description: "Used CBXR 15s3p battery with ~1100mi. Well taken care of, still plenty of life.",
        condition: "Used",
        price: 400
    },
    {
        title: "Stock XR Battery Harness",
        typeOfPart: ["Miscellaneous"],
        imageSrc: "/images/shop/xr_harness.png",
        platform: ["VESC Electronics"],
        availableCount: 1,
        description: "Stock XR battery harness with most of the battery box ends chopped up or otherwise removed. Good for parts or splicing up for your own builds.",
        condition: "Used",
        price: 25
    },
    {
        title: "C&R Air Pad for XR, Purple",
        typeOfPart: ["Footpad"],
        imageSrc: [
            "/images/shop/airpad1.png",
            "/images/shop/airpad2.png"
        ],
        platform: ["XR/Funwheel"],
        availableCount: 1,
        condition: "Used",
        price: 50
    },
    {
        title: "Thor300 with bad IMU",
        typeOfPart: ["Controller"],
        imageSrc: [
            "/images/shop/thor300imu.png"
        ],
        externalUrl: "https://fungineers.us/products/thor-300-funwheel-controller-esc",
        platform: ["VESC Electronics"],
        availableCount: 1,
        description: "Thor300 with a known bad IMU. Otherwise, turns on and operates normally. No other known issues.",
        condition: "For Parts",
        price: 100
    },
    {
        title: "Thor400 with blown IC",
        typeOfPart: ["Controller"],
        imageSrc: [
            "/images/shop/thor400ic1.png",
            "/images/shop/thor400ic2.png",
            "/images/shop/thor400ic3.png"
        ],
        externalUrl: "",
        platform: ["VESC Electronics"],
        availableCount: 1,
        description: "Thor400 with a blown IC. Has never been installed in a board - This IC blew on first boot, with nothing connected but power and a button. No other known issues.",
        condition: "For Parts",
        price: 200
    }
] as PartsShopData[]

export default allPartsShopItems.sort((a, b) => {
    if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
    } else {
        return a.title.localeCompare(b.title)
    }
})