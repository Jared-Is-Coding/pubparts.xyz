type ItemData = {
    /**
     * Item title text
     */
    title: string
    /**
     * Item fabrication method
     */ 
    fabricationMethod:
        | "3DP"
        | "CNC"
        | "Laser"
        | "Other"
    /**
     * Item type
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

type PartType =
    | "Axle Block"
    | "Battery Box"
    | "Bearing Cover"
    | "Bumper"
    | "Connector Cover"
    | "Controller Box"
    | "Fender"
    | "Footpad"
    | "Gasket"
    | "Miscellaneous"
    | "Motor"
    | "Motor Cover"
    | "Port Cover"
    | "Rail Attachment"
    | "Rails"
    | "Rim Saver"
    | "Stand"
    | "Tool"

type ResourceData = {
    /**
     * Resource title text
     */
    title: string
    /**
     * Resource type
     */ 
    typeOfResource: ResourceType[]
    /**
     * Resource external URL
     */
    externalUrl: string
    /**
     * Resource description text
     */
    description?: string
}

type ResourceType =
    | "Spreadsheet"
    | "Website"