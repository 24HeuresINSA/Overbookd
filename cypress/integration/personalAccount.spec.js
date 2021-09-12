

describe('test peronal account and money transfer', ()=> {
    it('should make a money transfer', function () {
        cy.visit('http://localhost:3000/login');
        // fill in form
        cy.get('[id=input-20]').type('user.secu');
        cy.get('[id=input-23]').type('user.secu');
        cy.contains('login').click();

        // logged in
        cy.get('#app > div > main > div > div > div > div.container > div > div:nth-child(3) > div > div.v-card__actions > button').click();

        cy.get('#app > div.v-dialog__content.v-dialog__content--active > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div.v-input__slot > div.v-select__slot > div.v-select__selections').click();
        cy.get('#list-item-153-5 > div > div').click();
        cy.get('#input-143').type('5');
        cy.get('#input-147').type('virement test')
        cy.get('#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions > button > span').click();
        // submitted transfer
    });
})