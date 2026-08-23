<template>
  <div class="flex min-h-screen flex-col bg-white font-sans text-ink">
    <AppTopBar />
    <AppHeader />
    <AppNav />
    <main class="flex-1"><slot /></main>
    <AppFooter />
    <ToastHost />
  </div>
</template>