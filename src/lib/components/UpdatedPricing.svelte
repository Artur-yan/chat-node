<script lang="ts">
  import { PUBLIC_CHAT_API_URL, PUBLIC_ENVIRONMENT } from '$env/static/public';
  import { goto, invalidateAll } from '$app/navigation';
  import { alert } from '$lib/stores';
  import { onMount } from 'svelte';


  export let includeMarketing: Boolean;
  export let userId: string;
  export let raaft_key: string;
  export let subscriptionId: string;
  export let currentPlan: number | undefined;
  export let referralCode: string = '';
  export let isCanceled: string = '';

  console.log('IsCanceled --->', isCanceled)

  let planToChangeTo: number;
  let isAnnual: boolean;
  let busyChangingPlan: boolean = false;
  let standardPlanState: number = 5;
  let grownthPlanState: number = 6;

  // Setting isAnnual based on user plan
  if([undefined, -1, 0, 2, 3, 4, 101, 102, 103, 104, 105, 106].includes(currentPlan)) {
    isAnnual = true
  } else {
    isAnnual = false
  }
 
  $: if(isAnnual) {
    standardPlanState = 105
    grownthPlanState = 106
  } else {
    standardPlanState = 5
    grownthPlanState = 6
  }

  $: if(currentPlan && [0, 1, 2, 3, 4, 101, 102, 103, 104].includes(currentPlan)) {
    alert.set({ type: 'warning', msg: 'Your are currently using a legacy plan' });
  }

  onMount(() => {
		if (PUBLIC_ENVIRONMENT === 'production' && rewardful) {
			rewardful('ready', function () {
				if (Rewardful.referral) {
					referralCode = Rewardful.referral;
				}
			});
		}
	});

  const updatePlan = async (newPlan: number, subscriptionId?: string, oldPlan?: number) => {
    if (newPlan === 0 && PUBLIC_ENVIRONMENT === 'production') {
      const monthlyPlans = [5, 6]
      const yearlyPlans = [6, 106]
      let flow = undefined
      if (yearlyPlans.includes(oldPlan)){
        flow = "waA8DAPhdyccWN4IjRcF"
      } else if (monthlyPlans.includes(oldPlan)) {
        flow = "wQnbhKvWkdL0AJYxwSIW"
      } else {
        flow = "wQnbhKvWkdL0AJYxwSIW"
      }


      raaft("startCancelFlow", {
        authKey: raaft_key, // generated in step 2
        flowId: flow,
        subscriptionId: subscriptionId, // same from step 2
        onComplete: function (outcome) {
          if (outcome === "saved" || outcome === "aborted") {
            return
          }
        }
    }
      )

      //... Any pre-cancel logic
  //     profitwell('init_cancellation_flow', {subscription_id: subscriptionId}).then(result => {
  //       // This means the customer either aborted the flow (i.e.
  //       // they clicked on "never mind, I don't want to cancel"), or
  //       // accepted a salvage attempt or salvage offer.
  //       // Thus, do nothing since they won't cancel.
  //       if (result.status === 'retained' || result.status === 'aborted') {
  //         return
  //       }
  //
  //
  //
  //
  //
  //       // At this point, the customer ended deciding to cancel (i.e.
  //       // they rejected the salvage attempts and the salvage offer).
  //       // It could also be the case the widget couldn't be shown properly for
  //       // some reason (for which case, `result.status` will be 'error'), but that
  //       // shouldn't stop them from cancelling.
  //       // The normal cancel flow goes here
  //       console.log('updating plan', newPlan);
  //     busyChangingPlan = true;
  //     fetch('/api/account/plan', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ newPlan, referralCode })
  //     }).then(response => response.json()) // Correctly calling .json() on the response object
  // .then(data => {
  //    setTimeout(() => {
  //       invalidateAll();
  //       window.location.href = data.url;
  //       busyChangingPlan = false;
  //     }, 2000);
  // })
  // .catch(error => {
  //   console.error('Error:', error); // Handling any errors that occur during the fetch
  //         $alert = { msg: 'Something went wrong', type: 'error' };
  // });
  //   }
  //   )

    }
    else {

      console.log('updating plan', newPlan);
      try {
        busyChangingPlan = true;
        const res = await fetch('/api/account/plan', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ newPlan, referralCode })
        });
        const data = await res.json();
        setTimeout(() => {
          invalidateAll();
          window.location.href = data.url;
          busyChangingPlan = false;
        }, 2000);

      } catch (err) {
        console.error(err);
        $alert = { msg: 'Something went wrong', type: 'error' };
      }
    }

  };

  const handleConfirmPlanChange = async (plan: number) => {
		planToChangeTo = plan;

    if(currentPlan === -1 || currentPlan === 0) {
      const res = await fetch(`${PUBLIC_CHAT_API_URL}/api/update-plan`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id: userId,
					plan: planToChangeTo
				})
			});

      const data = await res.json();
      const stripeLink = data.url;
      goto(stripeLink, { invalidateAll: true })
    } else {
			modalConfirmPlanChange.showModal();
		}
	};

  const handleCancelPlan = () => {
    // modalCancelPlan.showModal();
    updatePlan(0, subscriptionId, currentPlan)

  }
</script>

<div id="pricing" class="isolate overflow-hidden bg-gray-900">
  <div class="mx-auto max-w-7xl px-6 pb-96 pt-12 text-center lg:px-8">
    <div class="mx-auto max-w-4xl">
      {#if includeMarketing}
        <h2 class="text-base font-semibold leading-7 text-indigo-400">Plans</h2>
        <h1 class="p-2 text-4xl font-bold tracking-tight sm:text-6xl text-transparent text-white">Affordable Pricing</h1>
      {/if}
    </div>
    <div class="relative mt-2">
      {#if includeMarketing}
        <p class="mx-auto max-w-2xl text-lg leading-8 text-white/60">Flexible Pricing for Every Business Size</p>
      {/if}

      <!-- Toggle -->
      <div 
        on:click={() => isAnnual = !isAnnual}
        on:keydown={(e) => {if (e.key === 'Enter') isAnnual = !isAnnual}}
        class="flex justify-center max-w-[14rem] m-auto mb-8 lg:mt-6">
        <div class="relative flex w-full p-1 bg-white bg-opacity-40 rounded-full">
            <span class="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                <span class="absolute inset-0 w-1/2 bg-indigo-600 rounded-full shadow-sm shadow-indigo-950/10 transform transition-transform duration-150 ease-in-out {isAnnual ? 'translate-x-0' : 'translate-x-full'}"></span>
            </span>
            <button 
              class="relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150 ease-in-out {isAnnual ? 'text-white' : 'text-slate-100'}" 
              aria-pressed={isAnnual}>Yearly 
              <span 
                class="{isAnnual ? 'text-indigo-200' : 'text-slate-300'}">-16%
              </span>
            </button>
            <button 
              class="relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150 ease-in-out {isAnnual ? 'text-slate-100' : 'text-white'}" 
              aria-pressed={isAnnual}>Monthly
            </button>
        </div>
    </div>
      <div class="hidden md:block">
        <svg viewBox="0 0 1208 1024" class="absolute -top-16 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]">
          <ellipse cx="604" cy="512" fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" rx="604" ry="512" />
          <defs>
            <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
              <stop stop-color="#7335DE" />
              <stop offset="1" stop-color="#6746FA" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
  <div class="flow-root pb-24 sm:pb-16">
    <div class="-mt-80">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid max-w-lg grid-cols-1 lg:grid-cols-3 gap-8 lg:max-w-5xl">
          <div class="flex flex-col justify-between rounded-3x p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-8 rounded-3xl bg-[#828DF8] md:bg-slate-100 md:bg-opacity-40">
            <div>
              <h3 class="text-4xl font-semibold leading-7 text-gray-800">Standard</h3>
              <div class="mt-4 flex items-baseline gap-x-2">
                <span 
                  class="text-3xl font-bold tracking-tight text-gray-600 line-through"
                >{isAnnual ? "$59" : ""}</span>
                <span class="text-4xl font-bold tracking-tight text-gray-100">{isAnnual ? "$50" : "$59"}</span>
                <span class="text-base font-semibold leading-7 text-gray-100">/ Month</span>
              </div>
              <p class="mt-6 text-base leading-7 text-gray-800 font-bold">2-week free trial</p>
              <ul class="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                <li class="flex items-center gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  1 user
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  5,000 bot answers
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  3 chatbots
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Embed on unlimited websites
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Slack, Crisp, Typebot Integrations
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Chatbot history
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Capture leads
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Customize chatbot design
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  API access
                </li>
              </ul>
            </div>
            {#if currentPlan === -1 || currentPlan === 0 || isCanceled}
              <button 
                on:click={() => handleConfirmPlanChange(isAnnual ? 105 : 5)}
                disabled={currentPlan === standardPlanState}
                class="flex w-full justify-center mt-10 bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2 border-indigo-600 {currentPlan === standardPlanState && !isCanceled ? 'bg-indigo-600' : 'bg-black'}"
              >
                <span class="mx-1 text-white font-bold text-xl">Start Free Trial</span>
              </button>
            {:else if !currentPlan}
              <a href="{isAnnual ? '/register?plan=105&status=free_trial' : '/register?plan=5&status=free_trial'}">
                <button class="flex w-full justify-center mt-10 bg-black bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2  border-indigo-600">
                  <span class="mx-1 text-white font-bold text-xl">Start Free Trial</span>
                </button>  
              </a>     
            {:else}
              <button 
                on:click={() => handleConfirmPlanChange(isAnnual ? 105 : 5)}
                disabled={currentPlan === standardPlanState && !isCanceled}
                class="flex w-full justify-center mt-10 bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2 border-indigo-600 {currentPlan === standardPlanState && !isCanceled ? 'bg-indigo-600' : 'bg-black'}"
              >
                <span class="mx-1 text-white font-bold text-xl">{currentPlan === standardPlanState ? 'Current Plan' : 'Change Plan'}</span>
              </button>  
            {/if}   
          </div>
          <div class="flex flex-col justify-between rounded-3xl bg-[#828DF8] md:bg-slate-100 md:bg-opacity-40 p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-8">
            <div>
              <h3 id="tier-team" class="text-4xl font-semibold leading-7 text-gray-800">Growth</h3>
              
              <div class="mt-4 flex items-baseline gap-x-2">
                <span 
                  class="text-3xl font-bold tracking-tight text-gray-600 line-through"
                >{isAnnual ? "$99" : ""}</span>
                <span class="text-4xl font-bold tracking-tight text-gray-100">{isAnnual ? "$83" : "$99"}</span>
                <span class="text-base font-semibold leading-7 text-gray-100">/ Month</span>
              </div>
              <p class="mt-4 text-base leading-7 text-gray-800 font-bold">2-week free trial</p>
              <ul class="mt-10 space-y-4 text-sm leading-6 text-gray-100">
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Everything on Standard plan
                </li>
                <li class="flex gap-x-3 items-center">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  10,000 bot answers
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  5 chatbots
                </li>
                <!-- <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  1M tokens per bot (≈1M words)
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  5 chatbots
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Remove "Powered by ChatNode"
                </li> -->
              </ul>
            </div>
            {#if currentPlan === -1 || currentPlan === 0 || isCanceled}
              <button 
                on:click={() => handleConfirmPlanChange(isAnnual ? 106 : 6)}
                disabled={currentPlan === grownthPlanState && !isCanceled}
                class="flex w-full justify-center mt-10 bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2 border-indigo-600 {currentPlan === grownthPlanState && !isCanceled ? 'bg-indigo-600' : 'bg-black'}"
              >
                <span class="mx-1 text-white font-bold text-xl">Start Free Trial</span>
              </button> 
            {:else if !currentPlan}
              <a href="{isAnnual ? '/register?plan=106&status=free_trial' : '/register?plan=6&status=free_trial'}">
                <button class="flex w-full justify-center mt-10 bg-black bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2 border-indigo-600">
                  <span class="mx-1 text-white font-bold text-xl">Start Free Trial</span>
                </button>   
              </a>   
            {:else}
              <button 
                on:click={() => handleConfirmPlanChange(isAnnual ? 106 : 6)}
                disabled={currentPlan === grownthPlanState}
                class="flex w-full justify-center mt-10 bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2 border-indigo-600 {currentPlan === grownthPlanState ? 'bg-indigo-600' : 'bg-black'}"
              >
                <span class="mx-1 text-white font-bold text-xl">{currentPlan === grownthPlanState ? 'Current Plan' : 'Change Plan'}</span>
              </button>  
            {/if}   
          </div>

          <div class="flex flex-col justify-between rounded-3x p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-8 rounded-3xl bg-[#828DF8] md:bg-slate-100 md:bg-opacity-40">
            <div>
              <h3 class="text-4xl leading-7 text-gray-800 font-bold">Custom</h3>
              <div class="mt-4 flex items-baseline gap-x-2">
                <a href="mailto:contact@chatnode.ai">
                  <span class="text-3xl font-bold tracking-tight text-gray-100">Contact Us</span>
                </a>
                <span class="text-base font-semibold leading-7 text-gray-100 hidden"></span>
              </div>
              <p class="mt-6 text-base leading-7 text-gray-300 invisible">14-days free trial</p>
              <ul class="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Everything in Growth plan
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Personalized 1:1 onboarding
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  We set up your chatbots
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  VIP support (Dedicated Key Account Manager)
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Use Personal OpenAI API Key
                </li>
              </ul>
            </div>
            <a href="mailto:contact@chatnode.ai">
              <button class="flex w-full justify-center mt-10 bg-black bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2  border-indigo-600">
                <span class="mx-1 text-white font-bold text-xl">Contact Us</span>
              </button>   
            </a>       
          </div>
        </div>
        <div class="mx-auto grid max-w-lg grid-cols-1 lg:grid-cols-3 gap-8 lg:max-w-5xl">
          <div class="mx-auto text-center text-md text-gray-300">
            {#if currentPlan !== -1 && currentPlan !== 0 && !isCanceled}
              <button class="my-2 mx-auto text-center text-md text-gray-300 underline" on:click={handleCancelPlan}>Cancel your subscription</button>
            {/if}
          </div>
          <p class="my-2 mx-auto text-center text-md text-gray-300">* 100 free messages during trial</p>
          <p class="my-2 mx-auto text-center text-md text-gray-300"></p>
        </div>
      </div>
    </div>
  </div>
</div>

{#if currentPlan}
	<!-- Open the modal using ID.showModal() method -->
	<dialog id="modalConfirmPlanChange" class="modal">
		<form method="dialog" class="modal-box shadow-xl shadow-slate-400">
			<h3 class="font-bold text-lg mb-4">
				{planToChangeTo > currentPlan ? 'You will be billed immediately!' : 'Are you Sure?'}
			</h3>
			<p class="mb-8">
				{planToChangeTo > currentPlan
					? 'Your card on file will be billed immediately for the new amount minus the prorated amount from your previous plan.'
					: 'Your plan will automatically be downgraded at the end of the billing period.'}
			</p>

			<div class="text-right">
				<button class="btn">Cancel</button>
				<button class="btn bg-indigo-500 hover:bg-indigo-600" on:click|preventDefault={() => updatePlan(planToChangeTo)}>
					{busyChangingPlan ? 'Updating...' : 'Change Plan'}
				</button>
			</div>
		</form>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}

{#if currentPlan !== 0}
<!-- Open the modal using ID.showModal() method -->
  <dialog id="modalCancelPlan" class="modal">
    <form method="dialog" class="modal-box shadow-xl shadow-slate-400">
      <h3 class="font-bold text-lg mb-4">
        Are you Sure?      
      </h3>
      <p class="mb-8">
        Your plan will be canceled at the end of the billing cycle.
      </p>

      <div class="text-right">
        <button class="btn">Close</button>
        <button class="btn bg-indigo-500 hover:bg-indigo-600" on:click|preventDefault={() => updatePlan(0, subscriptionId)}>
          {busyChangingPlan ? 'Updating...' : 'Cancel Plan'}
        </button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
{/if}