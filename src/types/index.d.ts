type itemData = {
    /**
     * Item title text
     */
    title: string
    /**
     * Item price text
     */ 
    fabricationMethod: "CNC" | "3d Printed" | "Other"
    /**
     * Item type text
     */ 
    typeOfPart: "Rail" | "Motor" | "Footpad" | "Battery Box" | "Controller Box" | "Bumper" | "Axle Block" | "Miscellaneous" | "Fender"
    /**
     * Image source url
     */
    imageSrc: string
    /**
     * Item external URL
     */
    externalUrl?: string
    /**
     * Item ZIP direct download URL
     */
    zipUrl?: string
    /**
     * Item ZIP direct download last updated
     */
    zipLastUpdated?: string
    /**
     * Item price text
     */ 
    price?: string
}