export const mastData = [
    { name: 'Aerotech', size: 'RDM', length: 'all', profile: 8 },
    { name: 'Aerotech', size: 'SDM', length: 'all', profile: 7 },
    { name: 'Attitude Sails', size: 'RDM', length: 'all', profile: 13 },
    { name: 'Attitude Sails', size: 'SDM', length: 'all', profile: 13 },
    { name: 'Avanti Sails', size: 'RDM', length: 'all', profile: 3 },
    { name: 'Avanti Sails', size: 'SDM', length: 'all', profile: 9 },
];

mastData.forEach((row) => row['year'] = 2019);