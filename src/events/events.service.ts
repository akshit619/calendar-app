import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from './event.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
    private events: Event[] = [];

    findAll(): Event[] {
        return this.events;
    }

    findOne(id: string): Event {
        const event = this.events.find(e => e.id === id);
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

    create(eventData: Partial<Event>): Event {
        const newEvent: Event = {
            id: uuidv4(),
            title: eventData.title,
            description: eventData.description || '',
            datetime: eventData.datetime,
            imageUrl: eventData.imageUrl,
            videoUrl: eventData.videoUrl,
            createdAt: new Date().toISOString(),
        };
        this.events.push(newEvent);
        return newEvent;
    }

    update(id: string, updates: Partial<Event>): Event {
        const event = this.findOne(id);
        Object.assign(event, updates);
        return event;
    }

    delete(id: string): void {
        this.events = this.events.filter(e => e.id !== id);
    }
}