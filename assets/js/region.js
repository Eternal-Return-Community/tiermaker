const availableRegions = ['global', 'seoul', 'ohio', 'frankfurt', 'asia2', 'saopaulo'];

export default () => {
    while (true) {
        const region = prompt('Region: ')
        if (availableRegions.includes(region?.toLowerCase())) return region;
        alert(`Available Regions: ${availableRegions.join(', ')}`);
    }
}