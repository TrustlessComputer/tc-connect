export type IBTCNetwork = 'mainnet' | 'testnet' | 'regtest';
export interface INetwork {
    Name: string;
    Key: string;
    ChainID: number | string;
    TCNode: string;
    BTCNetwork: IBTCNetwork;
    Explorer: string;
    BE_API: string;
    Icon: string;
    BTCExplorer: string;
    ConnectURL: string;
    ARTIFACT_CONTRACT: string;
    BNS_CONTRACT: string;
    BFS_CONTRACT: string;
}
export declare const NETWORKS: Array<INetwork>;
