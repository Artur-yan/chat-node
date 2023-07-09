<div class="container grid grid-cols-[12rem_auto] gap-4">
    <div>
                <ul class="menu bg-base-200 w-56 rounded-box" role="navigation">
                  <li class="menu-title">Settings</li>
                <li><a href="settings">General</a></li>
                <li><a href="settings/sharing">Sharing</a></li>
                <li><a href="settings/prompts">Prompts</a></li>
                <li><a href="settings/theme">Theme</a></li>
                <li><a href="settings/theme">GPT Version</a></li>
              </ul>
    </div>
    <div>

        <slot />
    </div>
</div>