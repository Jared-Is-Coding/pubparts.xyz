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
    typeOfPart: PartType[]
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
    dropboxUrl?: string
    /**
     * Item ZIP direct download last updated
     */
    dropboxZipLastUpdated?: string
    /**
     * Item price text
     */ 
    price?: string
}

type PartType = "Rail" | "Motor" | "Footpad" | "Battery Box"
                | "Controller Box" | "Bumper" | "Axle Block"
                | "Miscellaneous" | "Fender" | "Port Cover"
                | "Stand" | "Rim Saver" | "Rail Attachment"