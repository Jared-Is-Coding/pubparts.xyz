
const allPartsShopItems = [
    {
        title: "Black anodized CNC PubBox V2.2 with lid (raw lid, needs countersinking), window, and optional parts packs",
        typeOfPart: ["Controller Box"],
        imageSrc: "/images/shop/cnc_pubbox_v2_second.png",
        externalUrl: "/parts/xr?search=PubWheel:%20CNC%20PubBox%20V2%20-%20XR%20VESC%20Box,%20Lid",
        platform: ["XR/Funwheel"],
        availableCount: 4,
        description: `
            <p>All parts:</p>
            <ul>
                <li>
                    6061 anodized black pubbox with the change logs:
                    <ul>
                        <li>Breather hole -> Increase diameter to 20.5mm</li>
                        <li>Controller mounts -> Add JF6 mounts</li>
                        <li>Accessory mounts -> Add corner mounts</li>
                        <li>Handle -> Raise handle interior to match gasket seal height</li>
                        <li>Handle -> Raise handle exterior accordingly</li>
                    </ul>
                </li>
                <li>6061 raw alu lid without logo and without countersinks (just pictured clear to see the box)</li>
                <li>Acrylic window</li>
            </ul>
            <p>This offering is only for the parts listed above and does not include hardware and printed pieces. If you're interested in those, I'm able to put together packs to include as requested, of the following:</p>
            <ul>
                <li>
                    $15 - Printed Pack
                    <ul>
                        <li>1 x Right/Left Pubbox bumper spacers (the little tabs) in black TPU</li>
                        <li>1 x Lid gasket in black TPU</li>
                        <li>1 x <a href="https://www.printables.com/model/1095537" target="_blank">Unified cable cover</a> (motor splash guard) in black PETG</li>
                    </ul>
                </li>
            </ul>
            <ul>
                <li>
                    $35 - Hardware Pack
                    <ul>
                        <li>4 x 10-32 3/4" countersunk bolts for rail mounting</li>
                        <li>34 x M3x8 countersunk bolts for lid and LED clips</li>
                        <li>1 x GX16-4 charge port</li>
                        <li>1 x 19x1 power button (12V LED, momentary or latching, black/silver case options, white/blue/red/green/yellow options)</li>
                        <li>1 x 6 pin footpad switchcraft connector</li>
                        <li>2 x 20mm glands</li>
                        <li>1 x Goretex vent patch</li>
                    </ul>
                </li>
            </ul>
        `,
        condition: "New",
        price: 180
    },
    {
        title: "20mm Goretex vent patches",
        typeOfPart: ["Miscellaneous"],
        imageSrc: "/images/shop/goretex_patch.png",
        platform: ["Miscellaneous Items"],
        availableCount: 39,
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
        title: "Used front XR bumpers",
        typeOfPart: ["Bumper"],
        imageSrc: "/images/shop/xr_bumper_f.png",
        externalUrl: "https://onewheel.com/products/c-bump",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "Plain old stock XR front bumper",
        condition: "Used",
        price: 5
    },
    {
        title: "150mm x 12mm x 1.5mm aluminum LED backer plate",
        typeOfPart: ["LED"],
        imageSrc: "/images/shop/led_plate.png",
        platform: ["XR/Funwheel"],
        availableCount: -1,
        description: "Helpful to mount loose LED strips to for use in the box",
        condition: "New",
        price: 5
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
        title: "Stock XR charger",
        typeOfPart: ["Charger"],
        imageSrc: "/images/shop/xr_charger.png",
        externalUrl: "https://onewheel.com/products/xr-home-charger",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        description: "",
        condition: "Like New",
        price: 35
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
        title: "Pint Replacement Hub Bolts",
        typeOfPart: ["Bolt"],
        imageSrc: "/images/shop/pint_screws.png",
        platform: ["Pint/X/S"],
        availableCount: 1,
        description: "Full set of 4 replacement hub bolts",
        condition: "New",
        price: 5
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
        title: "GT BMS (HW 6407, 600mi)",
        typeOfPart: ["BMS"],
        imageSrc: "/images/shop/gt_bms.png",
        platform: ["GT/GT-S"],
        availableCount: 1,
        description: "",
        condition: "Like New",
        price: 95
    },
    {
        title: "GT-V power PCB with bad capacitor",
        typeOfPart: ["Controller"],
        imageSrc: "/images/shop/gtv_controller.png",
        platform: ["GT/GT-S"],
        availableCount: 1,
        description: "This is the power PCB from a GT-V kit. It's got a cap busted off but is otherwise in perfect shape",
        condition: "For Parts",
        price: 50
    },
    {
        title: "Fungineers Superflux stock axle blocks (Pair)",
        typeOfPart: ["Axle Block"],
        imageSrc: "/images/shop/sf_ab.png",
        externalUrl: "https://fungineers.us/products/adapters",
        platform: ["XR/Funwheel"],
        availableCount: 1,
        condition: "New",
        price: 25
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
        title: "Pint/XR Extended Stand",
        typeOfPart: ["Stand"],
        imageSrc: "https://media.printables.com/media/prints/675193/images/5307332_dfb11e9f-7a67-4a34-8876-e8885097bb35_2e1e4578-5070-4401-b9e1-b937c19c8806/thumbs/inside/1280x960/png/make.webp",
        externalUrl: "https://www.printables.com/model/675193",
        platform: ["Miscellaneous Items"],
        availableCount: 1,
        description: "Just a printed stand",
        condition: "Like New",
        price: 15
    },
    {
        title: "Z-Hooks: Wedge and Foot Hook w/ Hardware (Front+Rear Set)",
        typeOfPart: ["Footpad Attachment"],
        imageSrc: "/images/shop/hooks.png",
        platform: ["Miscellaneous Items"],
        availableCount: -1,
        description: `
            <p>Paired with hooks modified from original designs by @seanbrowntown, this hook-wedge system offers mounted foot hooks with adjustable height, angle, and placement.</p>
            <p>Printed in TPU, these hooks are indestructible. They can be mounted to the footpad in a handful of ways, with more options available in the future:</p>
            <ul>
                <li>Bottom Mount Wedge: Countersunk screw goes up through footpad and/or footpad backer into wedge, from bottom. Hook is then screwed into wedge from the top. This method requires removal of the footpad in order to remove the wedge, but is very sturdy.</li>
                <li>Top Mount Wedge: Socket with washer goes down into footpad inserts, from top. Hook is then screw into wedge from the top. This method allows removal of the whole system without removal of the pad, but requires very solid inserts on the pad to receive the screw.</li>
                <li>Coming in the future (Let me know if you'd be interested): Top Mount Wedge with grooves to allow variable adjustment of the wedge placement after installation.</li>
            </ul>
            <p>In cases where not a full set of hooks and wedges is needed, or additional individual parts are requested, here are the individual parts costs for reference:</p>
            <ul>
                <li>$35 per hook</li>
                <li>$25 per wedge (with hardware)</li>
            </ul>
        `,
        condition: "New",
        price: 120
    },
    {
        title: "1.43in AMOLED Display replacements, for WaveShare 1.43in AMOLED assemblies",
        typeOfPart: ["Display"],
        imageSrc: "/images/shop/amoled_display.png",
        platform: ["VESC Electronics"],
        availableCount: 6,
        description: `
            <p>These are DO0143FMST12 display panels (CO5300/FT3168) from DWO Limited. Their shipping is a flat rate $30, so these were ordered in bulk to save people on shipping. To order yourself would be $36/1, $21/2, $16/3, $14/4, $12/5.</p>
            <p>Or, order them from me for $10 + shipping a piece.</p>
        `,
        condition: "New",
        price: 10
    },
    {
        title: "SF/XR Clamping Blocks (Finned)",
        typeOfPart: ["Axle Block"],
        imageSrc: "/images/shop/clamping_block.png",
        externalUrl: "/parts/xr?search=PubParts:%20Finned%20Clamping%20SuperFlux/HyperCore%20to%20XR%20Rails",
        platform: ["XR/Funwheel"],
        availableCount: 17,
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
        price: 105
    },
    {
        title: "Leaf Blaster Pubmote (Full Build)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/contactsimonwilson/PubRemote/raw/master/docs/builds/leaf-blaster-assembly.png",
        externalUrl: "https://github.com/contactsimonwilson/PubRemote/blob/master/docs/builds/leaf-blaster.md",
        platform: ["VESC Electronics"],
        availableCount: -1,
        description: "Fully build Pubmote based on the Leaf Blaster design.",
        condition: "New",
        price: 120
    },
    {
        title: "Leaf Blaster Pubmote (Parts Kit)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/contactsimonwilson/PubRemote/raw/master/docs/builds/leaf-blaster-assembly.png",
        externalUrl: "https://github.com/contactsimonwilson/PubRemote/blob/master/docs/builds/leaf-blaster.md",
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
        imageSrc: "https://github.com/contactsimonwilson/PubRemote/raw/master/docs/builds/snowmote2-assembly.png",
        externalUrl: "https://github.com/contactsimonwilson/PubRemote/blob/master/docs/builds/snowmote2.md",
        platform: ["VESC Electronics"],
        availableCount: -1,
        description: "Fully build Pubmote based on the Snowmote 2 design.",
        condition: "New",
        price: 120
    },
    {
        title: "Snowmote 2 Pubmote (Parts Kit)",
        typeOfPart: ["Remote"],
        imageSrc: "https://github.com/contactsimonwilson/PubRemote/raw/master/docs/builds/snowmote2-assembly.png",
        externalUrl: "https://github.com/contactsimonwilson/PubRemote/blob/master/docs/builds/snowmote2.md",
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
    }
] as PartsShopData[]

export default allPartsShopItems.sort((a, b) => a.title.localeCompare(b.title))