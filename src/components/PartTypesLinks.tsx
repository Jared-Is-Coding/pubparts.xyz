import React from "react"
import { FaFolder } from "react-icons/fa6"

/**
 * Creates a collection of Windows 95 style desktop icons
 * for navigating website parts lists.
 */
export default () => (
    <div className="flex-row flex-wrap">
        <a href="/parts/floatwheel" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">Floatwheel</span>
        </a>
        <a href="/parts/gt" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">GT/GT-S</span>
        </a>
        <a href="/parts/pint" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">Pint/X/S</span>
        </a>
        <a href="/parts/xr" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">XR/Funwheel</span>
        </a>
        <a href="/parts/xrclassic" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">XR Classic</span>
        </a>
        <a href="/parts/misc" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">Misc Items</span>
        </a>
        <a href="/parts/electronics" className="desktop-icon">
            <FaFolder className="icon-image" style={{ color: '#F8E000' }} size={32} />
            <span className="icon-label">VESC Electronics</span>
        </a>
    </div>
)
