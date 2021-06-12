/// <reference types="cypress" />

const speed = 100;
const workDuration = 60;
const breakDuration = 30;
const longBreakDuration = 60;
const workTime = workDuration * 1000 / speed;
const breakTime = breakDuration * 1000 / speed;
const longBreakTime = longBreakDuration * 1000 / speed;

context('Pomodoro', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:8080/?work=${workDuration}&break=${breakDuration}&long_break=${longBreakDuration}&speed=${speed}`)
  })

  it('should run normally', () => {
    cy.title().should('equal', 'Pomo')
    cy.get('button').contains('Start').click()
    cy.title().should('include', '🟢(W)')
    cy.get('button').not('Start')
    cy.get('button').contains('Pause')
    for (let i = 0; i < 3; i++) {
      cy.wait(workTime)
      cy.title().should('equal', '🔴 Take a break')
      cy.get('button').not('Pause')
      cy.get('button').contains('Continue').click()
      cy.get('button').contains('Pause')
      cy.wait(breakTime)
      cy.title().should('equal', '🔴 Continue work')
      cy.get('button').not('Pause')
      cy.get('button').contains('Continue').click()
      cy.get('button').contains('Pause')
    }
    cy.wait(workTime)
    cy.title().should('equal', '🔴 Take a break')
    cy.get('button').not('Pause')
    cy.get('button').contains('Continue').click()
    cy.get('button').contains('Pause')
    cy.wait(longBreakTime)
    cy.title().should('equal', '🔴 Continue work')
    cy.get('button').not('Pause')
    cy.get('button').contains('Continue')
    cy.get('button').contains('Stop').click()
  })
})
