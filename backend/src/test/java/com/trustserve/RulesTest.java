package com.trustserve;
import org.junit.jupiter.api.*;import org.junit.jupiter.params.ParameterizedTest;import org.junit.jupiter.params.provider.ValueSource;import java.time.*;import static org.junit.jupiter.api.Assertions.*;
class RulesTest {
@ParameterizedTest @ValueSource(strings={"Confirmed","Professional Assigned","Accepted","Rejected","Cancelled"}) void pendingTransitions(String s){assertDoesNotThrow(()->Rules.transition("Pending",s));}
@ParameterizedTest @ValueSource(strings={"Pending","Accepted","In Progress","Cancelled","Rejected"}) void completedTerminal(String s){assertThrows(IllegalArgumentException.class,()->Rules.transition("Completed",s));}
@ParameterizedTest @ValueSource(strings={"09:00","11:00","14:00","16:00"}) void futureSlots(String s){assertDoesNotThrow(()->Rules.future(LocalDate.now().plusDays(1),s));}
@ParameterizedTest @ValueSource(strings={"08:00","","24:00"}) void invalidSlots(String s){assertThrows(IllegalArgumentException.class,()->Rules.future(LocalDate.now().plusDays(1),s));}
@Test void past(){assertThrows(IllegalArgumentException.class,()->Rules.future(LocalDate.now().minusDays(1),"09:00"));}
@ParameterizedTest @ValueSource(strings={"short","12345678901","abcdefghijk",""}) void weakPasswords(String s){assertThrows(IllegalArgumentException.class,()->Rules.password(s));}
@Test void validPassword(){assertDoesNotThrow(()->Rules.password("TrustDemo123!"));}
@Test void invalidSlotUsesDomainException(){assertThrows(BookingRuleException.class,()->Rules.future(LocalDate.now().plusDays(1),"08:00"));}
@Test void invalidTransitionUsesDomainException(){assertThrows(BookingRuleException.class,()->Rules.transition("Pending","Completed"));}
@Test void weakPasswordUsesDomainException(){assertThrows(PasswordValidationException.class,()->Rules.password("weakpass"));}
@Test void nullDateRejected(){assertThrows(BookingRuleException.class,()->Rules.future(null,"09:00"));}
@Test void longPassword(){assertThrows(IllegalArgumentException.class,()->Rules.password("a1".repeat(37)));}
@Test void activeBlocks(){assertTrue(Rules.blocking("Accepted"));}
@Test void cancelledReleases(){assertFalse(Rules.blocking("Cancelled"));}
@Test void rejectedReleases(){assertFalse(Rules.blocking("Rejected"));}
@Test void acceptedStarts(){assertDoesNotThrow(()->Rules.transition("Accepted","In Progress"));}
@Test void runningCompletes(){assertDoesNotThrow(()->Rules.transition("In Progress","Completed"));}
@Test void cannotSkip(){assertThrows(IllegalArgumentException.class,()->Rules.transition("Pending","Completed"));}
}
