const availableRegions = {
    "sa": "saopaulo",
    "na": "ohio",
    "kr": "seoul",
    "euw": "frankfurt",
    "asia2": "asia2"
};

export default () => {
    while (true) {
        const region = prompt('Region: ')
        if (Object.keys(availableRegions).includes(region?.toLowerCase())) return availableRegions[region];
        alert(`Available Regions: ${Object.keys(availableRegions).join(', ').toUpperCase()}`);
    }
}