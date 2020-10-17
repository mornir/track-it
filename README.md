# Track it!

> Web extension to track time wasted on addictive websites

Are there websites that you wish you would visit less often? The web counts numerous addictive, unproductive, distractive websites. This web extension shows you the last time you visited such websites and encourages you to keep off of them.

## ✨ FEATURES

✔ Choose the websites you want to track  
✔ Show the collective last visit time  
✔ Show the longest streak to keep you motivated  
✔ Minimalist UI  
✔ Privacy-focused  
✔ Open-source

## 🤫 PRIVACY

This extension only reads your local history and doesn't share it. If you enabled sync for extension, the list of websites you track will be synchronized with Google account. If you disabled sync, it will only be stored locally.

## Calculation of the longest streak

The duration of longest streak is calculated between visits to exact URLs. For example, if you add "https://www.youtube.com", but always access YouTube through "https://www.youtube.com/feed/subscriptions" (e.g. via a bookmark), the later URL won't be taken into account.
The longest streak is only recorded over the last three months, because Chrome doesn't keep browser history records that are older than three months.
In my opinion, this is not an issue, because if you can refrain from visiting an addictive website for more than three months, you already succeeded.

# Credits

- Cover Photo by [Aron Visuals](https://unsplash.com/@aronvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText")
- Clock icon by [bqlqn](https://www.flaticon.com/authors/bqlqn) on [flaticon](https://www.flaticon.com/)
- [vue-cli-plugin-browser-extension](https://github.com/adambullmer/vue-cli-plugin-browser-extension) by [Adam Bullmer](https://github.com/adambullmer)

# Local development

## Project setup

```
yarn install
```

## Compiles and hot-reloads for development

```
yarn dev
```

## Compiles and minifies for production

```
yarn build
```

## Lints and fixes files

```
yarn lint
```
