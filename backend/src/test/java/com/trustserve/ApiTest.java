package com.trustserve;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

@SpringBootTest(properties={"spring.datasource.url=jdbc:h2:mem:testdb","trustserve.demo-password=Testing12345!"})
@AutoConfigureMockMvc
class ApiTest {
    @Autowired MockMvc mvc;

    @Test void publicServices() throws Exception {
        mvc.perform(get("/api/services")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(15));
    }
    @Test void publicCategories() throws Exception { mvc.perform(get("/api/categories")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(10)); }
    @Test void publicProfessionals() throws Exception { mvc.perform(get("/api/professionals")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(10)); }
    @Test void serviceDetailsExist() throws Exception { mvc.perform(get("/api/services/1")).andExpect(status().isOk()).andExpect(jsonPath("$.name").exists()); }
    @Test void missingServiceReturnsBadRequest() throws Exception { mvc.perform(get("/api/services/99999")).andExpect(status().isBadRequest()); }
    @Test void protectedBookings() throws Exception { mvc.perform(get("/api/bookings")).andExpect(status().isUnauthorized()); }
    @Test void protectedProfile() throws Exception { mvc.perform(get("/api/profile")).andExpect(status().isUnauthorized()); }
    @Test void protectedNotifications() throws Exception { mvc.perform(get("/api/notifications")).andExpect(status().isUnauthorized()); }
    @Test void protectedPayments() throws Exception { mvc.perform(get("/api/payments")).andExpect(status().isUnauthorized()); }
    @Test void protectedSupport() throws Exception { mvc.perform(get("/api/support")).andExpect(status().isUnauthorized()); }
    @Test void csrfRequired() throws Exception { mvc.perform(post("/api/auth/login").contentType("application/json").content("{}" )).andExpect(status().isForbidden()); }
    @Test void badCredentials() throws Exception { mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json").content("{\"email\":\"customer@trustserve.demo\",\"password\":\"wrong\"}")).andExpect(status().isBadRequest()); }
    @Test void loginWorks() throws Exception { mvc.perform(post("/api/auth/login").with(csrf()).contentType("application/json").content("{\"email\":\"customer@trustserve.demo\",\"password\":\"Testing12345!\"}")).andExpect(status().isOk()).andExpect(jsonPath("$.password").doesNotExist()); }
    @Test void cannotRegisterAdmin() throws Exception { mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json").content("{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"Testing12345!\",\"role\":\"ADMIN\"}")).andExpect(status().isBadRequest()); }
    @Test void rejectsMalformedRegistrationEmail() throws Exception { mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json").content("{\"name\":\"Test User\",\"email\":\"not-an-email\",\"password\":\"Testing12345!\",\"role\":\"CUSTOMER\"}")).andExpect(status().isBadRequest()); }
    @Test void customerNotAdmin() throws Exception { mvc.perform(get("/api/admin/data").with(user("2").roles("CUSTOMER"))).andExpect(status().isForbidden()); }
    @Test void adminDataAllowed() throws Exception { mvc.perform(get("/api/admin/data").with(user("1").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.users").exists()); }
    @Test void customerCanSeeOwnProfile() throws Exception { mvc.perform(get("/api/profile").with(user("2").roles("CUSTOMER"))).andExpect(status().isOk()).andExpect(jsonPath("$.user.id").exists()); }
    @Test void customerCanSeeBookingsList() throws Exception { mvc.perform(get("/api/bookings").with(user("2").roles("CUSTOMER"))).andExpect(status().isOk()); }
    @Test void customerCanSeePaymentsList() throws Exception { mvc.perform(get("/api/payments").with(user("2").roles("CUSTOMER"))).andExpect(status().isOk()); }
    @Test void customerCanSeeNotificationsList() throws Exception { mvc.perform(get("/api/notifications").with(user("2").roles("CUSTOMER"))).andExpect(status().isOk()); }
    @Test void customerCanSeeSupportList() throws Exception { mvc.perform(get("/api/support").with(user("2").roles("CUSTOMER"))).andExpect(status().isOk()); }
    @Test void customerCannotAccessAdminEndpoint() throws Exception { mvc.perform(get("/api/admin/data").with(user("2").roles("CUSTOMER"))).andExpect(status().isForbidden()); }
    @Test void csrfEndpointIsAccessible() throws Exception { mvc.perform(get("/api/auth/csrf")).andExpect(status().isOk()).andExpect(jsonPath("$.token").exists()).andExpect(jsonPath("$.header").exists()); }

    // Additional controller-level coverage: validation, mutation endpoints and admin workflows.
    @Test void rejectsDuplicateRegistration() throws Exception {
        mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json")
            .content("{\"name\":\"Another Customer\",\"email\":\"customer@trustserve.demo\",\"password\":\"Testing12345!\",\"role\":\"CUSTOMER\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void rejectsWeakRegistrationPassword() throws Exception {
        mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json")
            .content("{\"name\":\"New Customer\",\"email\":\"weakpass@example.com\",\"password\":\"weak\",\"role\":\"CUSTOMER\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void rejectsShortRegistrationName() throws Exception {
        mvc.perform(post("/api/auth/register").with(csrf()).contentType("application/json")
            .content("{\"name\":\"A\",\"email\":\"shortname@example.com\",\"password\":\"Testing12345!\",\"role\":\"CUSTOMER\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCanUpdateProfile() throws Exception {
        mvc.perform(put("/api/profile").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"name\":\"Aarav Updated\",\"phone\":\"9999999999\",\"address\":\"Ahmedabad Gujarat\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Aarav Updated"));
    }
    @Test void profileUpdateRejectsShortName() throws Exception {
        mvc.perform(put("/api/profile").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"name\":\"A\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void supportTicketRejectsShortMessage() throws Exception {
        mvc.perform(post("/api/support").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"subject\":\"Issue\",\"message\":\"short\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCanCreateSupportTicket() throws Exception {
        mvc.perform(post("/api/support").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"subject\":\"Booking help\",\"message\":\"Please help with a booking question.\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Please help with a booking question."));
    }
    @Test void adminCategoryRejectsBlankName() throws Exception {
        mvc.perform(post("/api/admin/categories").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"name\":\"   \"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCannotCreateAdminCategory() throws Exception {
        mvc.perform(post("/api/admin/categories").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"name\":\"Test Category\"}"))
            .andExpect(status().isForbidden());
    }
    @Test void adminVerificationRejectsInvalidStatus() throws Exception {
        mvc.perform(post("/api/admin/verification/1").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Unknown\",\"reason\":\"Test reason\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void adminVerificationRejectsShortReason() throws Exception {
        mvc.perform(post("/api/admin/verification/1").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Verified\",\"reason\":\"x\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void adminCanChangeUserActiveFlag() throws Exception {
        mvc.perform(post("/api/admin/users/2").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"active\":\"true\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.active").value(true));
    }
    @Test void adminCannotChangeAdminActiveFlag() throws Exception {
        mvc.perform(post("/api/admin/users/1").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"active\":\"true\"}"))
            .andExpect(status().isBadRequest());
    }


    // Phase 3 coverage: remaining endpoint validation and authorization paths.
    @Test void publicProfessionalReviewsEndpoint() throws Exception {
        mvc.perform(get("/api/professionals/1/reviews")).andExpect(status().isOk());
    }
    @Test void customerCannotSubmitVerificationDocument() throws Exception {
        mvc.perform(multipart("/api/verification").file("file", "demo".getBytes()).with(user("2").roles("CUSTOMER")).with(csrf()))
            .andExpect(status().isForbidden());
    }
    @Test void adminDocumentRequestRejectsMissingDocument() throws Exception {
        mvc.perform(get("/api/admin/document/1").with(user("1").roles("ADMIN")))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCannotDownloadAdminDocument() throws Exception {
        mvc.perform(get("/api/admin/document/1").with(user("2").roles("CUSTOMER")))
            .andExpect(status().isForbidden());
    }
    @Test void adminServiceRejectsInvalidPrice() throws Exception {
        mvc.perform(post("/api/admin/services").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"name\":\"Test Service\",\"description\":\"test\",\"price\":\"0\",\"duration\":\"60\",\"categoryId\":1}"))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCannotCreateServiceAsAdmin() throws Exception {
        mvc.perform(post("/api/admin/services").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"name\":\"Test Service\",\"description\":\"test\",\"price\":\"500\",\"duration\":\"60\",\"categoryId\":1}"))
            .andExpect(status().isForbidden());
    }
    @Test void adminSupportResponseRejectsInvalidStatus() throws Exception {
        mvc.perform(post("/api/admin/support/99999").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Unknown\",\"response\":\"Test response\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCannotModerateReview() throws Exception {
        mvc.perform(post("/api/admin/reviews/99999").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"visible\":\"false\",\"reason\":\"hide it\"}"))
            .andExpect(status().isForbidden());
    }
    @Test void adminModerationRejectsShortReason() throws Exception {
        mvc.perform(post("/api/admin/reviews/99999").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"visible\":\"false\",\"reason\":\"x\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void missingBookingInvoiceIsBadRequest() throws Exception {
        mvc.perform(get("/api/bookings/99999/invoice").with(user("2").roles("CUSTOMER")))
            .andExpect(status().isBadRequest());
    }
    @Test void missingBookingHistoryIsBadRequest() throws Exception {
        mvc.perform(get("/api/bookings/99999/history").with(user("2").roles("CUSTOMER")))
            .andExpect(status().isBadRequest());
    }
    @Test void reviewRejectsMissingBooking() throws Exception {
        mvc.perform(post("/api/reviews").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"bookingId\":99999,\"rating\":5,\"comment\":\"Good work\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void currentUserEndpointRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }
    @Test void adminSupportResponseRequiresAdminRole() throws Exception {
        mvc.perform(post("/api/admin/support/99999").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Resolved\",\"response\":\"Resolved\"}"))
            .andExpect(status().isForbidden());
    }

    // Phase 4: additional negative booking and file-validation paths.
    @Test void bookingRejectsMissingServiceId() throws Exception {
        mvc.perform(post("/api/bookings").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"professionalId\":1,\"date\":\""+java.time.LocalDate.now().plusDays(2)+"\",\"slot\":\"11:00\",\"address\":\"123 Example Street, Ahmedabad\",\"method\":\"Cash on Service\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void bookingRejectsMissingProfessionalId() throws Exception {
        mvc.perform(post("/api/bookings").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"serviceId\":1,\"date\":\""+java.time.LocalDate.now().plusDays(2)+"\",\"slot\":\"11:00\",\"address\":\"123 Example Street, Ahmedabad\",\"method\":\"Cash on Service\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void bookingRejectsShortAddress() throws Exception {
        mvc.perform(post("/api/bookings").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"serviceId\":1,\"professionalId\":1,\"date\":\""+java.time.LocalDate.now().plusDays(2)+"\",\"slot\":\"11:00\",\"address\":\"short\",\"method\":\"Cash on Service\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void bookingRejectsInvalidPaymentMethod() throws Exception {
        mvc.perform(post("/api/bookings").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"serviceId\":1,\"professionalId\":1,\"date\":\""+java.time.LocalDate.now().plusDays(2)+"\",\"slot\":\"11:00\",\"address\":\"123 Example Street, Ahmedabad\",\"method\":\"Wire Transfer\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void bookingRejectsSimulatedPaymentFailure() throws Exception {
        mvc.perform(post("/api/bookings").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"serviceId\":1,\"professionalId\":1,\"date\":\""+java.time.LocalDate.now().plusDays(2)+"\",\"slot\":\"11:00\",\"address\":\"123 Example Street, Ahmedabad\",\"method\":\"Cash on Service\",\"paymentResult\":\"fail\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void bookingRejectsInvalidDateFormat() throws Exception {
        mvc.perform(post("/api/bookings").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"serviceId\":1,\"professionalId\":1,\"date\":\"not-a-date\",\"slot\":\"11:00\",\"address\":\"123 Example Street, Ahmedabad\",\"method\":\"Cash on Service\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void professionalVerificationRejectsUnsupportedFileType() throws Exception {
        mvc.perform(multipart("/api/verification").file("file", "not a supported file".getBytes()).with(user("3").roles("PROFESSIONAL")).with(csrf()))
            .andExpect(status().isBadRequest());
    }
    @Test void adminSupportRejectsMissingTicket() throws Exception {
        mvc.perform(post("/api/admin/support/99999").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Resolved\",\"response\":\"Resolved\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void adminReviewModerationRejectsMissingReview() throws Exception {
        mvc.perform(post("/api/admin/reviews/99999").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"visible\":\"false\",\"reason\":\"valid moderation reason\"}"))
            .andExpect(status().isBadRequest());
    }


    // Phase 5: booking workflow endpoint edge cases and authorization.
    @Test void bookingStatusRejectsMissingBooking() throws Exception {
        mvc.perform(post("/api/bookings/99999/status").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Cancelled\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void bookingStatusRejectsCustomerNonCancelAction() throws Exception {
        mvc.perform(post("/api/bookings/99999/status").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Completed\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void professionalCannotStatusMissingBooking() throws Exception {
        mvc.perform(post("/api/bookings/99999/status").with(user("3").roles("PROFESSIONAL")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Accepted\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void customerCannotRespondToSupportAsAdmin() throws Exception {
        mvc.perform(post("/api/admin/support/99999").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Resolved\",\"response\":\"Issue resolved by demo admin\"}"))
            .andExpect(status().isForbidden());
    }
    @Test void adminSupportResponseRejectsShortResponse() throws Exception {
        mvc.perform(post("/api/admin/support/99999").with(user("1").roles("ADMIN")).with(csrf()).contentType("application/json")
            .content("{\"status\":\"Resolved\",\"response\":\"\"}"))
            .andExpect(status().isBadRequest());
    }
    @Test void reviewRejectsInvalidRatingForMissingBookingBeforeRatingCheck() throws Exception {
        mvc.perform(post("/api/reviews").with(user("2").roles("CUSTOMER")).with(csrf()).contentType("application/json")
            .content("{\"bookingId\":99999,\"rating\":0,\"comment\":\"A valid review comment\"}"))
            .andExpect(status().isBadRequest());
    }

}
