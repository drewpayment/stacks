<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import EmployeeNotes from '$lib/components/EmployeeNotes.svelte';
	import LegacyAlertModal from '$lib/components/LegacyAlertModal.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import type { EmployeeWithNotes } from '$lib/drizzle/postgres/db.model';
	import { Breadcrumb, BreadcrumbItem, Input, Label, Select } from 'flowbite-svelte';

	export let data;

	// how you read the id param from the url

	let { ee, campaigns, employees } = data;
	const {
		employeeProfile: profile,
		employeeCodes: codes,
		...employee
	} = (ee || { employeeProfile: null }) as EmployeeWithNotes;

	campaigns = campaigns || [];

	const getCodeForCampaign = (campaignId: string) => {
		const code = codes?.find((c) => c.campaignId === campaignId);
		return code?.employeeCode || '';
	};

	let phone = null as unknown as string;
	let phone2 = null as unknown as string;

	const formatPhoneNumber = (e: any, callback = (v: string) => {}) => {
		const value = e.target.value;

		if (!value || value.length < 10) return callback(value);

		const regex = /^(\d{0,3})(\d{0,3})(\d{0,4})$/g;
		const parts = regex.exec(value);

		if (parts) {
			callback(`(${parts[1]}) ${parts[2]}-${parts[3].substring(0, 4)}`);
		} else {
			callback(value);
		}
	};

	if (profile?.phone)
		formatPhoneNumber({ target: { value: profile?.phone } }, (res) => (phone = res));
	if (profile?.phone2)
		formatPhoneNumber({ target: { value: profile?.phone2 } }, (res) => (phone2 = res));
	
	const isLegacyMode = $page.url.searchParams.get('mode') === 'legacy';
</script>

<div class="pb-3">
	<h4 class="text-gray-900 dark:text-gray-50">Profile</h4>
	<p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">
		This information is private and used for employee management purposes.
	</p>
</div>

<div class="pb-4">
	<Breadcrumb aria-label="Breadcrumb">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href="/app/employee">Employees</BreadcrumbItem>
		<BreadcrumbItem>{employee?.firstName} {employee?.lastName}</BreadcrumbItem>
	</Breadcrumb>
</div>
		
{#if isLegacyMode}
<LegacyAlertModal showModal={true} 
	messageText="This is a legacy employee. Please update the information below." 
	btnConfirmDesc="Ok" 
	btnCancelDesc="Cancel"
	onCancel={() => window.location.href = `/app/employee`}
/>
{/if}

<form
	action="?/save"
	method="post"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		return async ({ result, update }) => {
			if (result.type !== 'success') return;
			
			window.location.href = `/app/employee/${result.data.employee.id}`;
		};
	}}
>
	<input type="hidden" name="isLegacy" value={isLegacyMode}>
	<input type="hidden" name="employeeId" value={ee?.id} required />
	<div
		class="bg-background-100 border-gray-100 border dark:border-gray-800 shadow-lg rounded-2xl px-6 pb-6"
	>
		<div class="border-b border-gray-900/10 pb-12">
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="col-span-full">
					<EmployeeNotes notes={employee?.employeeNotes} employeeId={$page.params.id} />
				</div>
			</div>
		</div>

		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">
				Personal Information
			</h2>
			<p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">
				Use a permanent address where you can receive mail.
			</p>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-3">
					<Label>
						First name
						<Input
							name="firstName"
							value={employee?.firstName}
							autocomplete="given-name"
							required
						/>
					</Label>
				</div>

				<div class="sm:col-span-3">
					<Label>
						Last name
						<Input name="lastName" value={employee?.lastName} autocomplete="family-name" required />
					</Label>
				</div>

				<div class="sm:col-span-4">
					<Label>
						Email
						<Input type="email" name="email" value={profile?.email} autocomplete="email" required />
					</Label>
				</div>

				<div class="sm:col-span-3">
					<Label>Phone number</Label>
					<Input
						type="tel"
						name="phone"
						id="phone"
						required
						autocomplete="phone"
						bind:value={phone}
						on:input={(e) => formatPhoneNumber(e, (res) => (phone = res))}
					/>
				</div>

				<div class="sm:col-span-3">
					<Label>Secondary Phone</Label>
					<Input
						type="tel"
						name="phone2"
						id="phone2"
						autocomplete="phone2"
						bind:value={phone2}
						on:input={(e) => formatPhoneNumber(e, (res) => (phone2 = res))}
					/>
				</div>

				<div class="col-span-full">
					<Label>
						Address
						<Input name="address" value={profile?.address} autocomplete="street-address" required />
					</Label>
				</div>

				<div class="sm:col-span-2 sm:col-start-1">
					<Label>
						City
						<Input name="city" value={profile?.city} autocomplete="address-level2" />
					</Label>
				</div>

				<div class="sm:col-span-2">
					<Label>
						State
						<Input name="state" value={profile?.state} autocomplete="address-level3" required />
					</Label>
				</div>

				<div class="sm:col-span-2">
					<Label>
						Zip Code
						<Input name="zip" value={profile?.zip} autocomplete="postal-code" required />
					</Label>
				</div>
			</div>
		</div>

		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">Sales Codes</h2>
			<p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">
				Sales codes are used to track sales and commissions. They are used to import sales data from
				sales commission reports
				<a href="/app/sales/import">here.</a>
				<br />
				<span class="text-xs text-gray-400 dark:text-gray-50">*Sales codes are not required.</span>
			</p>

			{#if campaigns?.length}
				<div class="flex mt-10 sm:gap-1 md:gap-6">
					{#each campaigns as campaign}
						<Label>
							{campaign?.name}
							<Input
								type="text"
								name={'code|campaign|' + campaign?.id}
								value={getCodeForCampaign(campaign?.id)}
							/>
						</Label>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex my-4">
			<Label class="min-w-36">
				Overrides to
				<Select
					placeholder="Select Manager"
					items={employees}
					name="overridesToEmployeeId"
					value={ee?.overrideTo?.employeeId}
				/>
			</Label>
		</div>

		<!-- <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">We'll always let you know about important changes, but you pick what else you want to hear about.</p>

      <div class="mt-10 space-y-10">
        <fieldset>
          <legend class="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
          <div class="mt-6 space-y-6">
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-900 focus:ring-primary-600">
              </div>
              <div class="text-sm leading-6">
                <label for="comments" class="font-medium text-gray-900">Comments</label>
                <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
              </div>
            </div>
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="candidates" name="candidates" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-900 focus:ring-primary-600">
              </div>
              <div class="text-sm leading-6">
                <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
              </div>
            </div>
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input id="offers" name="offers" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-900 focus:ring-primary-600">
              </div>
              <div class="text-sm leading-6">
                <label for="offers" class="font-medium text-gray-900">Offers</label>
                <p class="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
          <p class="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
          <div class="mt-6 space-y-6">
            <div class="flex items-center gap-x-3">
              <input id="push-everything" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-900 focus:ring-primary-600">
              <label for="push-everything" class="block text-sm font-medium leading-6 text-gray-900">Everything</label>
            </div>
            <div class="flex items-center gap-x-3">
              <input id="push-email" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-900 focus:ring-primary-600">
              <label for="push-email" class="block text-sm font-medium leading-6 text-gray-900">Same as email</label>
            </div>
            <div class="flex items-center gap-x-3">
              <input id="push-nothing" name="push-notifications" type="radio" class="h-4 w-4 border-gray-300 text-900 focus:ring-primary-600">
              <label for="push-nothing" class="block text-sm font-medium leading-6 text-gray-900">No push notifications</label>
            </div>
          </div>
        </fieldset>
      </div>
    </div> -->
		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button type="button" class="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50"
				>Cancel</button
			>
			<SubmitButton text="Save" />
			<!-- <button type="submit" class="rounded-md bg-primary-600 dark:bg-primary-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-200">Save</button> -->
		</div>
	</div>
</form>
