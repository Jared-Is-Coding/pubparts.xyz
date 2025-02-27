const allResources = [
    {
        title: "Floaty",
        typeOfResource: ["App"],
        appStoreLink: "https://apps.apple.com/us/app/id1671681675",
        playStoreLink: "https://play.google.com/store/apps/details?id=com.floaty.floatyapp",
        description: "Floaty is a companion app for VESC®-based balance skateboards, focused on providing a modern, sleek experience"
    },
    {
        title: "VESC Tool",
        typeOfResource: ["App"],
        appStoreLink: "https://apps.apple.com/us/app/id1605488891",
        playStoreLink: "https://play.google.com/store/apps/details?id=vedder.vesctool",
        description: "This is the mobile version of VESC Tool, which can be used to configure VESC®-based hardware over BLE"
    },
    {
        title: "Float Control: VESC Companion",
        typeOfResource: ["App"],
        appStoreLink: "https://apps.apple.com/us/app/id1590924299",
        description: "Connect to your VESC®-based esk8 skateboard builds via Bluetooth to monitor statistics such as voltage, amps, speed and many more."
    },
    {
        title: "Float Hub: VESC Setup Assistant",
        typeOfResource: ["App"],
        playStoreLink: "https://play.google.com/store/apps/details?id=com.thefloatlife.FloatHub",
        description: "Float Hub is your solution to an easy and streamlined setup process for your VESC®-based board."
    },
    {
        title: "Benjamin Vedder's Collection",
        typeOfResource: ["Github Repository"],
        externalUrl: "https://github.com/vedderb?tab=repositories",
        description: "All things VESC"
    },
    {
        title: "Avalon-Series Project",
        typeOfResource: ["Github Repository"],
        externalUrl: "https://github.com/EdKeate/Avalon-Series",
        description: "A work-in-progress, open-source, self-balancing electric-skateboard project."
    },
    {
        title: "AvaSpark",
        typeOfResource: ["Github Repository"],
        externalUrl: "https://github.com/tonyt321?tab=repositories",
        description: "AvaSpark's LED, RGB and Owie"
    },
    {
        title: "Motor Crunch Troubleshooting Guide",
        typeOfResource: ["Written Guide"],
        externalUrl: "https://pev.dev/t/motor-crunch-troubleshooting/228",
        description: "Does your motor make crunchy/cogging sounds when braking hard or accelerating?"
    },
    {
        title: "Surfdado VESC Setup Guide",
        typeOfResource: ["Video Guide"],
        externalUrl: "https://youtu.be/xaKGDummXeE",
        description: "VESC Onewheel Setup A-Z for 6.2 firmware (latest)"
    },
    {
        title: "TheBoardGarage VESC Setup Guide",
        typeOfResource: ["Video Guide"],
        externalUrl: "https://www.youtube.com/watch?v=YeFLmPA049o",
        description: "VESC Onewheel Setup for 6.2 firmware"
    },
    {
        title: "HyperCore Stock to Fungineers Motor Connector Replacement Guide",
        typeOfResource: ["Written Guide"],
        externalUrl: "https://pev.dev/t/1960",
        description: "This guide will help you install a Fungineers motor cable in your HyperCore motor."
    },
    {
        title: "TheBoardGarage Articles",
        typeOfResource: ["Written Guide"],
        externalUrl: "https://theboardgarage.com/articles",
        description: "Collection of battery related guides and articles"
    },
    {
        title: "How to Create CSV Logs",
        typeOfResource: ["Written Guide"],
        externalUrl: "https://pev.dev/t/how-to-create-csv-logs/436",
        description: "A guide to create CSV logs in VESC Tool App"
    },
    {
        title: "VESC Logs Tutorial",
        typeOfResource: ["Written Guide"],
        externalUrl: "https://docs.google.com/document/d/1DZV0oKDQWWqWCkOSJJDLrGvE0EA0v4Gj1mitOXhpvyM/edit",
        description: "How to view VESC Logs"
    },
    {
        title: "How to VESC a GT",
        typeOfResource: ["Video Guide"],
        externalUrl: "https://www.youtube.com/watch?v=BwStG5CRnPs&t",
        description: "Leon Chang's GT -> VESC Conversion Guide"
    },
    {
        title: "Soldering 101",
        typeOfResource: ["Video Guide"],
        externalUrl: "https://www.youtube.com/watch?v=ez99VcGNFJc",
        description: "Leon Chang's Soldering Guide"
    },
    {
        title: "All Things VESC Battery Comparison",
        typeOfResource: ["Spreadsheet"],
        externalUrl: "https://docs.google.com/spreadsheets/d/1EPqBROovzQ03iRKpK6Xfy0T7oEG6ZpiBP0-BecQBbUA/edit",
        description: "Battery pack data comparison tool for various controllers and battery configurations"
    },
    {
        title: "ADV 3d Printed List",
        typeOfResource: ["Spreadsheet"],
        externalUrl: "https://docs.google.com/spreadsheets/d/1mq-P3KeisLS-J33Qv6TXYyChz70qhU_axgL4iG-yIJk/edit",
        description: "3d parts and accessories for the Floatwheel ADV platform"
    },
    {
        title: "FloatFab",
        typeOfResource: ["Vendor"],
        externalUrl: "https://FloatFab.com",
        description: "Parts and guides for OneWheel and VESC boards"
    },
    {
        title: "Floatboxx",
        typeOfResource: ["Vendor"],
        externalUrl: "https://www.floatboxx.com/",
        description: "Metal parts for electric skateboards and PEVs"
    },
    {
        title: "Craft and Ride",
        typeOfResource: ["Vendor"],
        externalUrl: "https://craftandride.com/",
        description: "Aftermarket parts and accessories for the OneWheels"
    },
    {
        title: "The Float Life",
        typeOfResource: ["Vendor"],
        externalUrl: "https://thefloatlife.com/",
        description: "\"The original aftermarket accessory brand for OneWheels\""
    },
    {
        title: "Sharky Shred Shop",
        typeOfResource: ["Vendor"],
        externalUrl: "https://sharkyshredshop.com/",
        description: "\"Modesto, CA based shop offering third party repairs, parts, and accessories for OneWheel PEVs\""
    },
    {
        title: "PEV Dispensary",
        typeOfResource: ["Vendor"],
        externalUrl: "https://pevdispensary.com/",
        description: "#CleanGreenFun"
    },
    {
        title: "Atlowshop",
        typeOfResource: ["Vendor"],
        externalUrl: "https://www.atlowshop.com/",
        description: "\"Georgia-based personal electric vehicle (PEV) vesc sales and service shop\""
    },
    {
        title: "Ennoid",
        typeOfResource: ["Vendor"],
        externalUrl: "https://www.ennoid.me/home",
        description: "EV components & engineering services"
    },
    {
        title: "Spintend",
        typeOfResource: ["Vendor"],
        externalUrl: "https://spintend.com/",
        description: "Parts and controllers for PEVs"
    },
    {
        title: "Fungineers",
        typeOfResource: ["Vendor"],
        externalUrl: "https://www.fungineers.us/",
        description: "\"Freedom to build and repair your own board\""
    },
    {
        title: "Nickle Inc",
        typeOfResource: ["Vendor"],
        externalUrl: "https://nickleworks.com/",
        description: "\"Re-Imagining the Onewheel GT\""
    },
    {
        title: "Huff Designs",
        typeOfResource: ["Vendor"],
        externalUrl: "https://huff-designs.com/",
        description: "\"Open source, prefabricated OneWheel and PEV parts\""
    },
    {
        title: "Jet Fleet",
        typeOfResource: ["Vendor"],
        externalUrl: "https://www.jetfleet.store/",
        description: "\"Customized controllers for various personal electric vehicles (PEVs)\""
    },
    {
        title: "Indy Speed Control",
        typeOfResource: ["Vendor"],
        externalUrl: "https://indyspeedcontrol.com/",
        description: "\"Provider of high-performance lithium-ion batteries for electric vehicles\""
    },
    {
        title: "Vow Systems",
        typeOfResource: ["Vendor"],
        externalUrl: "https://vow.systems/",
        description: "\"Custom and repairable OneWheel parts, creating similarly functioning parts for each board frame type\""
    },
    {
        title: "Z Battery Solutions",
        typeOfResource: ["Vendor"],
        externalUrl: "https://zbattery.solutions/",
        description: "\"The best batteries in the game\""
    },
    {
        title: "Stoked Stock",
        typeOfResource: ["Vendor"],
        externalUrl: "https://www.stokedstock.com/",
        description: "Aftermarket parts and accessories for the OneWheels"
    },
    {
        title: "One Stop Board Shop",
        typeOfResource: ["Vendor"],
        externalUrl: "https://onestopboardshop.com/",
        description: "\"Your family owned premier shop for all things OneWheel, e-skate and everything PEV\""
    },
    {
        title: "AvaSpark",
        typeOfResource: ["Vendor"],
        externalUrl: "https://avaspark.com/",
        description: "\"Unlock your board's potential!\""
    },
    {
        title: "TheBoardGarage",
        typeOfResource: ["Vendor"],
        externalUrl: "https://theboardgarage.com/store/",
        description: "Battery, parts, and custom VESC build shop."
    },
    {
        title: "FloatFab",
        typeOfResource: ["Website"],
        externalUrl: "https://FloatFab.com",
        description: "VESC parts store, guide provider, repair shop, and more"
    },
    {
        title: "The VESC Bible",
        typeOfResource: ["Website"],
        externalUrl: "https://thevescbible.notion.site/b59f2fa721fc47549878adbcea43ac5b?v=e0e03c228c4b4c7f88ddb6932ca70db3",
        description: "A comprehensive compilation of essential information and responses to FAQ's within the Onewheel VESC community"
    },
    {
        title: "PEV.dev",
        typeOfResource: ["Website"],
        externalUrl: "https://pev.dev/",
        description: "A place to share information and ideas about DIY PEVs"
    },
    {
        title: "ESC Log Video",
        typeOfResource: ["Website"],
        externalUrl: "https://lachlanhurst.github.io/esc-log-video/",
        description: "Tool for generating data overlay videos from VESC log files"
    }
] as ResourceData[]

const resource = (resourceType: ResourceType) => {
    return allResources
        .filter((p) => p.typeOfResource.includes(resourceType))
        .sort((a, b) => a.title.localeCompare(b.title))
}

export default allResources
export const applicationsResources = resource("App")
export const codeRepositoriesResources = resource("Github Repository")
export const spreadsheetsResources = resource("Spreadsheet")
export const vendorsResources = resource("Vendor")
export const videoGuidesResources = resource("Video Guide")
export const websitesResources = resource("Website")
export const writtenGuidesResources = resource("Written Guide")