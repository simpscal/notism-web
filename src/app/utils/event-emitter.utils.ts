type EventCallback<T = unknown> = (payload: T) => void;

class EventEmitterUtils {
    private target = new EventTarget();

    emit<T = unknown>(eventName: string, payload?: T) {
        this.target.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
    }

    on<T = unknown>(eventName: string, callback: EventCallback<T>): () => void {
        const handler = (event: Event) => callback((event as CustomEvent<T>).detail);
        this.target.addEventListener(eventName, handler);

        return () => this.target.removeEventListener(eventName, handler);
    }
}

export const eventEmitterUtils = new EventEmitterUtils();
