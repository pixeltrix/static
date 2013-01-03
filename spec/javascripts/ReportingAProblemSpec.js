FORM_TEXT = '<div class="report-a-problem-container"><form><button class="button" name="button" type="submit">Send</button></form></div>';

describe("form submission for reporting a problem", function () {
    var form;

    beforeEach(function() {
        setFixtures(FORM_TEXT);
        form = $('form');
        form.submit(submitAProblemReport);
    });

    describe("while the request is being handled", function() {
        it("should disable the submit button to prevent multiple problem reports", function () {
            spyOn($, "ajax").andCallFake(function(options) {});

            form.triggerHandler('submit');

            expect($('.button')).toBeDisabled();
        });
    });

    describe("if the request succeeds", function() {
        it("should replace the form with the response from the AJAX call", function() {
            spyOn($, "ajax").andCallFake(function(options) {
                options.success({message: 'great success!'});
            });

            form.triggerHandler('submit');

            expect(form).toBeHidden();
            expect($('.report-a-problem-container').html()).toEqual('great success!');
        });
    });

    describe("if the request is invalid", function() {
        it("should re-enable the submit button, in order to allow the user to resubmit", function () {
            spyOn($, "ajax").andCallFake(function(options) {
                options.error({status: 422});
            });

            form.triggerHandler('submit');

            expect(form).toBeVisible();
            expect($('.button')).not.toBeDisabled();
        });
    });

    describe("if the request has failed for some other reason", function() {
        it("should replace the form with the error message from the AJAX call", function() {
            spyOn($, "ajax").andCallFake(function(options) {
                options.error({status: 500}, {message: "big failure"});
            });

            form.triggerHandler('submit');

            expect(form).not.toBeVisible();
            expect($('.report-a-problem-container').html()).toEqual('big failure');
        });
    });
});