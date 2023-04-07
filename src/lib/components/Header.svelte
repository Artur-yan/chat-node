<script>
    let links = [
        {
            title: "Features",
            href: "/"
        },
        {
            title: "Company",
            href: "/"
        },
        {
            title: "Contact",
            href: "/"
        }
    ]
</script>

<header class="py-2">
    <nav class="container">
        <div class="flex flex-wrap justify-between items-center mx-auto">
            <a href="/" class="py-4">
                <span class="text-xl">My.AI</span>
            </a>
            <div class="flex items-center lg:order-2">
                <a href="/account/chatbots/create" class="text-white bg-primary-500 hover:bg-secondary-300 hover:text-primary-600 focus:ring-4 focus:ring-primary-300 rounded text-sm px-4 py-3 lg:px-5 focus:outline-none transition-colors">+ Chatbot</a>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    {#each links as {title, href} }
                        <li>
                            <a {href} class="block hover:bg-gray-5">{title}</a>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </nav>
</header>