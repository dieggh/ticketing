import { NotFoundError } from "@diegodmicroserv/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get('/api/tickets/:id',
    async (req: Request, res: Response) => {
        const { id } = req.params;        
        const ticket = await Ticket.findById(id);
        if (ticket) {
            return res.send(ticket);
        } else {
            throw new NotFoundError();
        }
    });

export { router as showTicketRouter };