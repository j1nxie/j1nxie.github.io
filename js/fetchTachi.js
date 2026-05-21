const chunithmClassMap = {
    BLUE: "青",
    GREEN: "緑",
    ORANGE: "橙",
    RED: "赤",
    PURPLE: "紫",
    COPPER: "銅",
    SILVER: "銀",
    GOLD: "金",
    PLATINUM: "鉑",
    RAINBOW: "虹★",
    RAINBOW_II: "虹★★",
    RAINBOW_III: "虹★★★",
    RAINBOW_IV: "虹★★★★",
    RAINBOW_EX_I: "虹(極)★",
    RAINBOW_EX_II: "虹(極)★★",
    RAINBOW_EX_III: "虹(極)★★★"
};

const maimaiClassMap = {
    WHITE: "White",
    BLUE: "Blue",
    GREEN: "Green",
    YELLOW: "Yellow",
    RED: "Red",
    PURPLE: "Purple",
    BRONZE: "Bronze",
    SILVER: "Silver",
    GOLD: "Gold",
    PLATINUM: "Platinum",
    RAINBOW: "Rainbow"
};

const sdvxClassMap = {
    SIENNA_I: "Sienna I",
    SIENNA_II: "Sienna II",
    SIENNA_III: "Sienna III",
    SIENNA_IV: "Sienna IV",
    COBALT_I: "Cobalt I",
    COBALT_II: "Cobalt II",
    COBALT_III: "Cobalt III",
    COBALT_IV: "Cobalt IV",
    DANDELION_I: "Dandelion I",
    DANDELION_II: "Dandelion II",
    DANDELION_III: "Dandelion III",
    DANDELION_IV: "Dandelion IV",
    CYAN_I: "Cyan I",
    CYAN_II: "Cyan II",
    CYAN_III: "Cyan III",
    CYAN_IV: "Cyan IV",
    SCARLET_I: "Scarlet I",
    SCARLET_II: "Scarlet II",
    SCARLET_III: "Scarlet III",
    SCARLET_IV: "Scarlet IV",
    CORAL_I: "Coral I",
    CORAL_II: "Coral II",
    CORAL_III: "Coral III",
    CORAL_IV: "Coral IV",
    ARGENTO_I: "Argento I",
    ARGENTO_II: "Argento II",
    ARGENTO_III: "Argento III",
    ARGENTO_IV: "Argento IV",
    ELDORA_I: "Eldora I",
    ELDORA_II: "Eldora II",
    ELDORA_III: "Eldora III",
    ELDORA_IV: "Eldora IV",
    CRIMSON_I: "Crimson I",
    CRIMSON_II: "Crimson II",
    CRIMSON_III: "Crimson III",
    CRIMSON_IV: "Crimson IV",
    IMPERIAL_I: "Imperial I",
    IMPERIAL_II: "Imperial II",
    IMPERIAL_III: "Imperial III",
    IMPERIAL_IV: "Imperial IV"
};

fetch("https://kamai.tachi.ac/api/v1/users/Rylie/games/chunithm/Single")
    .then(resp => resp.json())
    .then(resp => {
        const body = resp.body;
        document.getElementById("chunithm-rating").innerText = `${body.gameStats.ratings.naiveRating} (${chunithmClassMap[body.gameStats.classes.colour]})`;
    });

fetch("https://kamai.tachi.ac/api/v1/users/Rylie/games/maimaidx/Single")
    .then(resp => resp.json())
    .then(resp => {
        const body = resp.body;
        document.getElementById("maimai-rating").innerText = `${body.gameStats.ratings.naiveRate} (${maimaiClassMap[body.gameStats.classes.colour]})`;
    });

fetch("https://kamai.tachi.ac/api/v1/users/Rylie/games/sdvx/Single")
    .then(resp => resp.json())
    .then(resp => {
        const body = resp.body;
        document.getElementById("sdvx-vf6").innerText = `${body.gameStats.ratings.VF6.toFixed(3)} (${sdvxClassMap[body.gameStats.classes.vfClass]})`;
    });
