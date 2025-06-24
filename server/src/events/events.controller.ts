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
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Get()
    findAll(): Event[]{
        // console.log('GET /events hit');
        return this.eventsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Event {
        return this.eventsService.findOne(id);
    }

    @Post()
    create(@Body() createEventDto: CreateEventDto): Event {
        return this.eventsService.create(createEventDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Event {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string): void {
        return this.eventsService.delete(id);
    }
}
