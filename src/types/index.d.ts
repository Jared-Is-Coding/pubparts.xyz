type itemData = {
    /**
     * Item title text
     */
    title: string
    /**
     * Item price text
     */ 
    fabricationMethod:
        | "3d Printed"
        | "CNC"
        | "Other"
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

type PartType =
    | "Axle Block"
    | "Battery Box"
    | "Bearing Cover"
    | "Bumper"
    | "Controller Box"
    | "Fender"
    | "Footpad"
    | "Miscellaneous"
    | "Motor"
    | "Motor Cover"
    | "Port Cover"
    | "Rail Attachment"
    | "Rail"
    | "Rim Saver"
    | "Stand"