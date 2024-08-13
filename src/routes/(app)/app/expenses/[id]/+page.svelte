<script lang="ts">
  import { Card, Table, Button, Badge, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Footer } from 'flowbite-svelte';
  import { ChevronLeft, Printer, ArrowDownCircle, Icon } from 'svelte-hero-icons';

  // Mock data for the expense report
  let report = {
    id: 1,
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    payPeriod: '2024-08-01 to 2024-08-15',
    submissionDate: '2024-08-16',
    status: 'Approved',
    approvedBy: 'Jane Manager',
    approvalDate: '2024-08-17',
    totalAmount: 450.75,
    expenses: [
      { id: 1, date: '2024-08-03', category: 'Travel', description: 'Flight to client meeting', amount: 300.00 },
      { id: 2, date: '2024-08-04', category: 'Meals', description: 'Lunch with client', amount: 75.50 },
      { id: 3, date: '2024-08-10', category: 'Office Supplies', description: 'Printer ink', amount: 55.25 },
      { id: 4, date: '2024-08-12', category: 'Miscellaneous', description: 'Parking fees', amount: 20.00 },
    ]
  };

  function goBack() {
    // In a real application, this would navigate back to the expense reports list
    console.log('Navigating back to expense reports list');
  }

  function printReport() {
    // Implement print functionality
    console.log('Printing report');
  }

  function downloadReport() {
    // Implement download functionality
    console.log('Downloading report');
  }
</script>

<div class="container max-w-5xl mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <Button color="light" href="/app/expenses">
      <Icon src={ChevronLeft} class="w-4 h-4 mr-2" /> Back to Reports
    </Button>
    <div>
      <Button color="light" class="mr-2" on:click={printReport}>
        <Icon src={Printer} class="w-4 h-4 mr-2" /> Print
      </Button>
      <Button color="blue" on:click={downloadReport}>
        <Icon src={ArrowDownCircle} class="w-4 h-4 mr-2" /> Download
      </Button>
    </div>
  </div>

  <Card class="w-full mb-6 max-w-5xl">
    <h1 class="text-2xl font-bold mb-4">Expense Report Details</h1>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="font-semibold">Employee Name:</p>
        <p>{report.employeeName} (ID: {report.employeeId})</p>
      </div>
      <div>
        <p class="font-semibold">Pay Period:</p>
        <p>{report.payPeriod}</p>
      </div>
      <div>
        <p class="font-semibold">Submission Date:</p>
        <p>{report.submissionDate}</p>
      </div>
      <div>
        <p class="font-semibold">Status:</p>
        <Badge
          color={report.status === 'Approved' ? 'green' : 
                 report.status === 'Pending' ? 'yellow' : 'red'}
        >
          {report.status}
        </Badge>
      </div>
      <div>
        <p class="font-semibold">Approved By:</p>
        <p>{report.approvedBy}</p>
      </div>
      <div>
        <p class="font-semibold">Approval Date:</p>
        <p>{report.approvalDate}</p>
      </div>
    </div>
  </Card>

  <Card class="w-full mb-6 max-w-5xl">
    <h2 class="text-xl font-semibold mb-4">Expense Items</h2>
    <Table hoverable={true}>
      <TableHead>
        <TableHeadCell>Date</TableHeadCell>
        <TableHeadCell>Category</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Amount</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each report.expenses as expense (expense.id)}
          <TableBodyRow>
            <TableBodyCell>{expense.date}</TableBodyCell>
            <TableBodyCell>{expense.category}</TableBodyCell>
            <TableBodyCell>{expense.description}</TableBodyCell>
            <TableBodyCell>${expense.amount.toFixed(2)}</TableBodyCell>
          </TableBodyRow>
        {/each}
        <TableBodyRow>
          <TableBodyCell colspan="3" class="text-right font-semibold">Total:</TableBodyCell>
          <TableBodyCell class="font-bold">${report.totalAmount.toFixed(2)}</TableBodyCell>
        </TableBodyRow>
      </TableBody>
    </Table>
  </Card>

  <div class="mt-4 text-sm text-gray-600">
    <p>Note: This expense report is associated with the paystub for the pay period {report.payPeriod}.</p>
    <p>For any questions or concerns, please contact the payroll department.</p>
  </div>
</div>