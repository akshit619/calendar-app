import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, 
} from '@nestjs/common';

import {EventsService} from './events.service';
import {Event} from './event.model';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    findAll(): Event[]{
        return this.eventsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Event {
        return this.eventsService.findOne(id);
    }

    @Post()
    create(@Body() body: Partial<Event>): Event {
        return this.eventsService.create(body);
    
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: Partial<Event>): Event {
        return this.eventsService.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string): void {
        return this.eventsService.delete(id);
    }
}
