"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    getName() {
        return 'address';
    }
    getMethods() {
        return [
            'zipCode',
            'zipCodeByState',
            'city',
            'cityPrefix',
            'citySuffix',
            'streetName',
            'streetAddress',
            'streetSuffix',
            'streetPrefix',
            'secondaryAddress',
            'county',
            'country',
            'countryCode',
            'state',
            'stateAbbr',
            'latitude',
            'longitude',
            'direction',
            'cardinalDirection',
            'ordinalDirection',
            'nearbyGPSCoordinate',
            'timeZone',
        ];
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map