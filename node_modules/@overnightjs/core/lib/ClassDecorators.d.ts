export declare function Controller(path: string): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {
        controllerBasePath: string;
    };
} & T;
