const availableRegions = {
    "sa": "saopaulo",
    "na": "ohio",
    "kr": "seoul",
    "euw": "frankfurt",
    "asia2": "asia2"
};

export default () => {
    const regions = Object.keys(availableRegions).join(', ').toUpperCase();
    while (true) {
        const region = prompt(`Region: ${regions}`)?.toLowerCase()
        if (Object.keys(availableRegions).includes(region)) return availableRegions[region];
        alert(`Available Regions: ${regions}`);
    }
}