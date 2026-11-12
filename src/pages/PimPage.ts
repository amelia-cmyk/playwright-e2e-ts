import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { EmployeeData } from '../utils/data-factory';

/** PIM > Add Employee / Employee List / Personal Details */
export class PimPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly listIdFilter: Locator;
  readonly searchButton: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.listIdFilter = page.locator('.oxd-table-filter .oxd-input-group', { hasText: 'Employee Id' }).locator('input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  async gotoAddEmployee(): Promise<void> {
    await this.page.goto('/web/index.php/pim/addEmployee');
    await this.waitForLoaded();
    await expect(this.firstNameInput).toBeVisible();
  }

  async gotoEmployeeList(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.waitForLoaded();
  }

  /** Creates an employee and returns its internal empNumber (taken from the redirect URL). */
  async addEmployee(employee: EmployeeData): Promise<number> {
    await this.firstNameInput.fill(employee.firstName);
    await this.middleNameInput.fill(employee.middleName);
    await this.lastNameInput.fill(employee.lastName);
    await this.employeeIdInput.fill(employee.employeeId);
    await this.waitForLoaded(); // form shows a loader overlay while it validates the Employee Id
    await this.saveButton.click();
    await this.expectSuccessToast('Successfully Saved');
    await this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
    const match = this.page.url().match(/empNumber\/(\d+)/);
    return Number(match![1]);
  }

  async searchById(employeeId: string): Promise<void> {
    await this.listIdFilter.fill(employeeId);
    await this.searchButton.click();
    await this.waitForLoaded();
  }
}
