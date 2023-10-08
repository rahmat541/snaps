import { rootRealmGlobal } from '../globalObject';
import consoleEndowment from './console';
import crypto from './crypto';
import date from './date';
import interval from './interval';
import math from './math';
import network from './network';
import textDecoder from './textDecoder';
import textEncoder from './textEncoder';
import timeout from './timeout';
// Array of common endowments
const commonEndowments = [
    {
        endowment: AbortController,
        name: 'AbortController'
    },
    {
        endowment: AbortSignal,
        name: 'AbortSignal'
    },
    {
        endowment: ArrayBuffer,
        name: 'ArrayBuffer'
    },
    {
        endowment: atob,
        name: 'atob',
        bind: true
    },
    {
        endowment: BigInt,
        name: 'BigInt'
    },
    {
        endowment: BigInt64Array,
        name: 'BigInt64Array'
    },
    {
        endowment: BigUint64Array,
        name: 'BigUint64Array'
    },
    {
        endowment: btoa,
        name: 'btoa',
        bind: true
    },
    {
        endowment: DataView,
        name: 'DataView'
    },
    {
        endowment: Float32Array,
        name: 'Float32Array'
    },
    {
        endowment: Float64Array,
        name: 'Float64Array'
    },
    {
        endowment: Int8Array,
        name: 'Int8Array'
    },
    {
        endowment: Int16Array,
        name: 'Int16Array'
    },
    {
        endowment: Int32Array,
        name: 'Int32Array'
    },
    {
        endowment: Uint8Array,
        name: 'Uint8Array'
    },
    {
        endowment: Uint8ClampedArray,
        name: 'Uint8ClampedArray'
    },
    {
        endowment: Uint16Array,
        name: 'Uint16Array'
    },
    {
        endowment: Uint32Array,
        name: 'Uint32Array'
    },
    {
        endowment: URL,
        name: 'URL'
    },
    {
        endowment: WebAssembly,
        name: 'WebAssembly'
    }
];
/**
 * Creates a consolidated collection of common endowments.
 * This function will return factories for all common endowments including
 * the additionally attenuated. All hardened with SES.
 *
 * @returns An object with common endowments.
 */ const buildCommonEndowments = ()=>{
    const endowmentFactories = [
        crypto,
        interval,
        math,
        network,
        timeout,
        textDecoder,
        textEncoder,
        date,
        consoleEndowment
    ];
    commonEndowments.forEach((endowmentSpecification)=>{
        const endowment = {
            names: [
                endowmentSpecification.name
            ],
            factory: ()=>{
                const boundEndowment = typeof endowmentSpecification.endowment === 'function' && endowmentSpecification.bind ? endowmentSpecification.endowment.bind(rootRealmGlobal) : endowmentSpecification.endowment;
                return {
                    [endowmentSpecification.name]: harden(boundEndowment)
                };
            }
        };
        endowmentFactories.push(endowment);
    });
    return endowmentFactories;
};
export default buildCommonEndowments;

//# sourceMappingURL=commonEndowmentFactory.js.map