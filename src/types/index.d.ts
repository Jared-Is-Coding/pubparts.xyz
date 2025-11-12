interface ItemData {
    /**
     * Item title text
     */
    title: string
    /**
     * Item fabrication method
     */ 
    fabricationMethod: FabricationMethod[]
    /**
     * Item type
     */ 
    typeOfPart: PartType[]
    /**
     * Image source url
     */
    imageSrc: string
    /**
     * Platform type
     */
    platform: PlatformType[]
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
    | "Adapter"
    | "Axle Block"
    | "Battery Assembly"
    | "Battery Box"
    | "Bearing Cover"
    | "BMS"
    | "Bracket"
    | "Breakout Board"
    | "Bumper"
    | "Connector Cover"
    | "Controller Box"
    | "Controller"
    | "Fender"
    | "Fender Delete"
    | "Footpad"
    | "Footpad Attachment"
    | "Gasket"
    | "Hall Sensor"
    | "LED"
    | "Miscellaneous"
    | "Motor"
    | "Motor Cover"
    | "Plug"
    | "Port Cover"
    | "Rail Attachment"
    | "Rails"
    | "Remote"
    | "Rim Saver"
    | "Stand"
    | "Tire"
    | "Tool"

type FabricationMethod =
    | "3d Printed"
    | "CNC"
    | "Laser"
    | "Other"
    | "PCB"

type PlatformType = 
    | "Floatwheel"
    | "GT/GT-S"
    | "Miscellaneous Items"
    | "Pint/X/S"
    | "VESC Electronics"
    | "XR/Funwheel"
    | "XR Classic"

interface ResourceData {
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
    externalUrl?: string
    /**
     * Apple App Store link
     */
    appStoreLink?: string
    /**
     * Google Play Store link
     */
    playStoreLink?: string
    /**
     * Resource description text
     */
    description?: string
}

type ResourceType =
    | "App"
    | "Github Repository"
    | "Written Guide"
    | "Video Guide"
    | "Spreadsheet"
    | "Vendor"
    | "Website"

interface PartsShopData {
    /**
     * Item title text
     */
    title: string
    /**
     * Item type
     */ 
    typeOfPart: PartShopType[]
    /**
     * Platform type
     */
    platform: PlatformType[]
    /**
     * How many of these are left
     */
    availableCount: number
    /**
     * Item price number
     */ 
    price: number
    /**
     * Item description text
     */ 
    condition: ItemCondition
    /**
     * Image source url
     */
    imageSrc?: string
    /**
     * Item description text
     */ 
    description?: string
    /**
     * Item external URL
     */
    externalUrl?: string
}

type PartShopType =
    | PartType
    | "Axle Block Attachment"
    | "Battery"
    | "Bolt"
    | "Charger"
    | "Display"
    | "Sensor"

type ItemCondition =
    | "New"
    | "Like New"
    | "Used"
    | "For Parts"