<script lang="ts">
  export let includeMarketing: Boolean;
  let isAnnual = false;
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
  <div class="flow-root pb-24 sm:pb-32">
    <div class="-mt-80">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid max-w-lg grid-cols-1 lg:grid-cols-3 gap-8 lg:max-w-5xl">
          <div class="flex flex-col justify-between rounded-3x p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10 rounded-3xl bg-slate-100 bg-opacity-40">
            <div>
              <h3 class="text-4xl font-semibold leading-7 text-gray-800">Standard</h3>
              <div class="mt-4 flex items-baseline gap-x-2">
                <span 
                  class="text-3xl font-bold tracking-tight text-gray-600 line-through"
                >{isAnnual ? "$59" : ""}</span>
                <span class="text-4xl font-bold tracking-tight text-gray-100">{isAnnual ? "$50" : "$59"}</span>
                <span class="text-base font-semibold leading-7 text-gray-100">/ Month</span>
              </div>
              <p class="mt-6 text-base leading-7 text-gray-300">14-days free trial</p>
              <ul class="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  5,000 messages credit
                </li>
                <li class="flex gap-x-3 text-white">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  500,000 tokens per bot
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
                  Unlimited data sources
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
                  Customise chatbot design
                </li>
              </ul>
            </div>
            <a href="{isAnnual ? '/register?plan=105&status=free_trial' : '/register?plan=5&'}">
              <button class="flex w-full justify-center mt-10 bg-black bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2  border-indigo-600">
                <span class="mx-1 text-white font-bold text-xl">Start Free Trial</span>
              </button>  
            </a>       
          </div>
          <div class="flex flex-col justify-between rounded-3xl bg-slate-100 bg-opacity-40 p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
            <div>
              <h3 id="tier-team" class="text-4xl font-semibold leading-7 text-gray-800">Growth</h3>
              
              <div class="mt-4 flex items-baseline gap-x-2">
                <span 
                  class="text-3xl font-bold tracking-tight text-gray-600 line-through"
                >{isAnnual ? "$99" : ""}</span>
                <span class="text-4xl font-bold tracking-tight text-gray-100">{isAnnual ? "$83" : "$99"}</span>
                <span class="text-base font-semibold leading-7 text-gray-100">/ Month</span>
              </div>
              <p class="mt-6 text-base leading-7 text-gray-300">14-days free trial</p>
              <ul class="mt-10 space-y-4 text-sm leading-6 text-gray-100">
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Everything on Standard plan
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  10,000 messages credit
                </li>
                <li class="flex gap-x-3">
                  <svg class="h-6 w-5 flex-none text-black" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  Unlimited messages with OpenAI key
                </li>
                <li class="flex gap-x-3">
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
                </li>
              </ul>
            </div>
            <a href="{isAnnual ? '/register?plan=106&status=free_trial' : '/register?plan=6&status=free_trial'}">
              <button class="flex w-full justify-center mt-10 bg-black bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2 border-indigo-600">
                <span class="mx-1 text-white font-bold text-xl">Start Free Trial</span>
              </button>   
            </a>        
          </div>

          <div class="flex flex-col justify-between rounded-3x p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10 rounded-3xl bg-slate-100 bg-opacity-40">
            <div>
              <h3 class="text-4xl leading-7 text-gray-800 font-bold">Custom</h3>
              <div class="mt-4 flex items-baseline gap-x-2">
                <span class="text-3xl font-bold tracking-tight text-gray-100">Contact Us</span>
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
              </ul>
            </div>
            <a href="/contact">
              <button class="flex w-full justify-center mt-10 bg-black bg-opacity-40 px-3.5 py-2.5 text-md font-semibold rounded-md border-2  border-indigo-600">
                <span class="mx-1 text-white font-bold text-xl">Contact Us</span>
              </button>   
            </a>       
          </div>


          <!-- Add ons -->
          <div class="flex flex-col items-start gap-x-1 gap-y-6  bg-gray-500 bg-opacity-25 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:gap-y-10 sm:p-10 lg:col-span-3 lg:flex-row lg:items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>                      
            <h1 class="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-500 text-transparent bg-clip-text">Add-ons</h1>
            <div class="mx-auto max-w-4xl">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div class="p-5 bg-slate-500 bg-opacity-50 rounded-md text-left text-indigo-300  border-2 border-purple-400">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-5 h-5 text-purple-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                    <h3 class="text-lg font-bold">Extra Messages</h3>
                  </div>
                  <p class="text-slate-100">$7 per 1,000</p>
                </div>

                <div class="p-5 bg-slate-500 bg-opacity-50 rounded-md text-left text-indigo-300  border-2 border-purple-500">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-5 h-5 text-purple-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                    
                    <h3 class="text-lg font-bold">Extra Chatbot</h3>
                  </div>
                  <p class="text-slate-100">$7 per 1 Chatbot</p>
                </div>

                <div class="p-5 bg-slate-500 bg-opacity-50 rounded-md text-left text-indigo-300  border-2 border-purple-600">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-5 h-5 text-purple-500">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                    </svg>                    
                    <h3 class="text-lg font-bold">Custom Domain</h3>
                  </div>
                  <p class="text-indigo-100">$59</p>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
