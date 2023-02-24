interface resultType {
    status: number;
    header?: Record<string, string>;
    responder?: null | any;
}
interface mixtureOptionsProps {
    domain?: string;
    method: string;
    timeout?: number;
    headers?: Record<string, string>;
    body?: Record<string, string>;
    variable?: Record<string, string>;
    parameter?: Record<string, string>;
    before?: Record<string, (request_url: string, config: any) => void>;
    after?: Record<string, (successful: resultType, failure: null | string) => void>;
    retry?: number;
    shortenedCatalogue?: Boolean;
    replacementProtocol?: Boolean;
    woo?: {
        consumerKey: string;
        consumerSecret: string;
    };
}

/**
 *
 * @param url
 * @param options
 * @returns
 */
declare function mixture(url: string, options: mixtureOptionsProps): Promise<resultType | undefined>;

export { mixture as default };
