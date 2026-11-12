import { test, expect } from '../../../src/fixtures/test-fixtures';
import { DataFactory } from '../../../src/utils/data-factory';

test.describe('PIM > Employee', () => {
  const createdEmpNumbers: number[] = [];

  // Hybrid cleanup: remove test data through the app's REST API instead of clicking through the UI
  test.afterEach(async ({ page }) => {
    if (createdEmpNumbers.length === 0) return;
    const res = await page.request.delete('/web/index.php/api/v2/pim/employees', {
      data: { ids: createdEmpNumbers.splice(0) },
    });
    expect(res.ok(), 'cleanup should delete created employees').toBeTruthy();
  });

  test('admin can add a new employee @smoke', async ({ pimPage }) => {
    const employee = DataFactory.employee();

    await pimPage.gotoAddEmployee();
    const empNumber = await pimPage.addEmployee(employee);
    createdEmpNumbers.push(empNumber);

    // Personal Details form is re-loaded from the backend → proves the data was persisted
    await expect(pimPage.firstNameInput).toHaveValue(employee.firstName);
    await expect(pimPage.lastNameInput).toHaveValue(employee.lastName);
    await expect(pimPage.employeeIdInput).toHaveValue(employee.employeeId);
  });

  test('new employee can be found in the employee list by ID', async ({ pimPage }) => {
    const employee = DataFactory.employee();
    await pimPage.gotoAddEmployee();
    createdEmpNumbers.push(await pimPage.addEmployee(employee));

    await pimPage.gotoEmployeeList();
    await pimPage.searchById(employee.employeeId);

    await expect(pimPage.tableRows).toHaveCount(1);
    await expect(pimPage.tableRows.first()).toContainText(employee.employeeId);
    await expect(pimPage.tableRows.first()).toContainText(employee.lastName);
  });

  test('first and last name are required', async ({ page, pimPage }) => {
    await pimPage.gotoAddEmployee();
    await pimPage.saveButton.click();

    await expect(page.locator('.oxd-input-field-error-message')).toHaveText(['Required', 'Required']);
    await expect(page).toHaveURL(/\/pim\/addEmployee/);
  });
});
