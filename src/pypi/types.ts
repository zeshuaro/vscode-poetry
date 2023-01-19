// eslint-disable-next-line @typescript-eslint/naming-convention
type PypiLastSerial = { "_last-serial": number };

// eslint-disable-next-line @typescript-eslint/naming-convention
type PypiSimpleMeta = PypiLastSerial & { "api-version": string };

type PypiProject = PypiLastSerial & { name: string };

export type PypiSimple = { meta: PypiSimpleMeta; projects: PypiProject[] };
