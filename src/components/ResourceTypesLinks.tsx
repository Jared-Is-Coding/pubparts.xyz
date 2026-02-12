import React from "react"
import { FaFileLines } from "react-icons/fa6"

/**
 * Creates a collection of Windows 95 style desktop icons
 * for navigating website resources lists.
 */
export default () => (
    <div className="flex-row flex-wrap">
        <a href="/resources/applications" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Applications</span>
        </a>
        <a href="/resources/repositories" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Code Repos</span>
        </a>
        <a href="/resources/spreadsheets" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Spreadsheets</span>
        </a>
        <a href="/resources/vendors" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Vendors</span>
        </a>
        <a href="/resources/videoguides" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Video Guides</span>
        </a>
        <a href="/resources/websites" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Websites</span>
        </a>
        <a href="/resources/writtenguides" className="desktop-icon">
            <FaFileLines className="icon-image" style={{ color: '#ffffff' }} size={32} />
            <span className="icon-label">Written Guides</span>
        </a>
    </div>
)
