package com.trustserve;
import org.springframework.stereotype.Service;import org.springframework.scheduling.annotation.Async;
@Service public class NoticeService {final NotificationRepository repo;public NoticeService(NotificationRepository r){repo=r;} @Async public void send(Account a,String message){Notification n=new Notification();n.recipient=a;n.message=message;repo.save(n);}}
