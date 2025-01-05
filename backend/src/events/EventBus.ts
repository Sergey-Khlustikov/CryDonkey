import EventEmitter from 'events'

interface IEventBus {
  emit(event: string, payload: any): void;

  on(event: string, listener: (payload: any) => void): void;

  off(event: string, listener: (payload: any) => void): void;
}

class EventBus implements IEventBus {
  private eventEmitter = new EventEmitter();

  emit(event: string, payload: any): void {
    this.eventEmitter.emit(event, payload);
  }

  on(event: string, listener: (payload: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  off(event: string, listener: (payload: any) => void): void {
    this.eventEmitter.off(event, listener);
  }
}

export default new EventBus();
