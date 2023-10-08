import { PermissionType, SubjectType } from '@metamask/permission-controller';
import { bip32entropy, Bip32PathStruct, SnapCaveatType } from '@metamask/snaps-utils';
import { assertStruct } from '@metamask/utils';
import { ethErrors } from 'eth-rpc-errors';
import { boolean, enums, object, optional } from 'superstruct';
import { getNode } from '../utils';
const targetName = 'snap_getBip32PublicKey';
export const Bip32PublicKeyArgsStruct = bip32entropy(object({
    path: Bip32PathStruct,
    curve: enums([
        'ed25519',
        'secp256k1'
    ]),
    compressed: optional(boolean())
}));
/**
 * The specification builder for the `snap_getBip32PublicKey` permission.
 * `snap_getBip32PublicKey` lets the Snap retrieve public keys for a particular
 * BIP-32 node.
 *
 * @param options - The specification builder options.
 * @param options.methodHooks - The RPC method hooks needed by the method implementation.
 * @returns The specification for the `snap_getBip32PublicKey` permission.
 */ const specificationBuilder = ({ methodHooks })=>{
    return {
        permissionType: PermissionType.RestrictedMethod,
        targetName,
        allowedCaveats: [
            SnapCaveatType.PermittedDerivationPaths
        ],
        methodImplementation: getBip32PublicKeyImplementation(methodHooks),
        validator: ({ caveats })=>{
            if (caveats?.length !== 1 || caveats[0].type !== SnapCaveatType.PermittedDerivationPaths) {
                throw ethErrors.rpc.invalidParams({
                    message: `Expected a single "${SnapCaveatType.PermittedDerivationPaths}" caveat.`
                });
            }
        },
        subjectTypes: [
            SubjectType.Snap
        ]
    };
};
const methodHooks = {
    getMnemonic: true,
    getUnlockPromise: true
};
export const getBip32PublicKeyBuilder = Object.freeze({
    targetName,
    specificationBuilder,
    methodHooks
});
/**
 * Builds the method implementation for `snap_getBip32PublicKey`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.getMnemonic - A function to retrieve the Secret Recovery Phrase of the user.
 * @param hooks.getUnlockPromise - A function that resolves once the MetaMask extension is unlocked
 * and prompts the user to unlock their MetaMask if it is locked.
 * @returns The method implementation which returns a public key.
 * @throws If the params are invalid.
 */ export function getBip32PublicKeyImplementation({ getMnemonic, getUnlockPromise }) {
    return async function getBip32PublicKey(args) {
        await getUnlockPromise(true);
        assertStruct(args.params, Bip32PublicKeyArgsStruct, 'Invalid BIP-32 public key params', ethErrors.rpc.invalidParams);
        const { params } = args;
        const node = await getNode({
            curve: params.curve,
            path: params.path,
            secretRecoveryPhrase: await getMnemonic()
        });
        if (params.compressed) {
            return node.compressedPublicKey;
        }
        return node.publicKey;
    };
}

//# sourceMappingURL=getBip32PublicKey.js.map