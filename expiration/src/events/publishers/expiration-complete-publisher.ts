import { ExpirationCompleteEvent, Publisher, Subjects } from "@diegodmicroserv/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}