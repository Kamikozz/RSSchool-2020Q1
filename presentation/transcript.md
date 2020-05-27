**Slide 1**: Opening. Hi everybody. Let me introduce these slides about React Native framework.

**Slide 2**: So what is React Native? Let's start from React part also known React.js.
It's a JS library for building user interfaces.
Typically we use React.JS in web development for building web
apps. Also, we use another library called ReactDOM. In the React we call ReactDOM.render() method
and it renders something to the screen, so this library knows how to render HTML elements.
React itself is Platform agnostic - it's just a library that is good at building trees of
components of finding out whether something is changed, something needs to be rerendered. You are
not restricted to use React on any platform. You can use the logic, React gives you anywhere. 

**Slide 3**: React Native is separate library which has a collection of "special" React components.
These components are special because React Native actually knows how to translate them into Native
Widgets for iOS or Android. React Native knows how to exact talk to the platform. It also gives you 
access to the native platform API's (et. to use device camera). And it gives you tools to connect
javascript and Native Platform Code.

**Slide 4**: Combining these features: React (which knows how to update user interface, how to
control it) and React Native we will get Real Native Mobile Applications. That's all React Native
gives you - it gives you everything you need to take your JS code and compile that into real
mobile app, which you can ship to App Store (on iOS) or Play Market (on Android).

**Slide 5**: So now, if we know what React Native is let's take a look behind the scenes.
As I mentioned React & React Native we build an app and our code looks something like this.
And there we use special components "Text" and "View" these are not normal HTML elements because
they are not supported, native platforms don't know how to use them. Text & View components
translates into native components by React Native which instructions native platforms are
available to understand.
Now it's important to understand: "Views" they are compiled into real native
application. Your javascript code, where you write business logic will not to be compiled.

**Slide 6**: It's important to understand that you can of course use React for building web apps,
but you can also build native apps for android & iOS with native code without React Native.
So there are 4 different ways to write mobile apps.
If you are using React in Web you typically work with (let's say it's) "div" to structure your
content.
If you are building a native android app you will be working with "android.view" for
example. That would be a widget or something else, but this "view" will be the element to structure
your content. On iOS platform this will be UIView widget. React Native component will be <View>. 
View tag looks like HTML tag, but this is different, this tag will be translated into "android.view"
or "UIView" appropriate platform.

**Slide 7**: Now as I already mentioned it's important to understand that for UI React Native gives
you special components which are compiled into Native Views for your overall logic. Everything on
the Javascript is not compiled into Native Code, but instead it's running in the special thread
hosted by React Native. So you can imagine, that React Native App is already compiled as a real
native app, but there is extra mini-app inside of your app, mini javascript running in the thread
hosted by React Native, which runs all of your JS code. And your Javascript code can then talk
to the Native Platform.

**Slide 8**: Let's demonstrate this. You have your code, your app, you build a native app, that's
running on a native platform and of course there are certain platform features available (like
for example using Device Camera).
Then, your code can be split into your Views and your business logic, so there is other js code.
Your views are compiled into Native Views/ into Native Widgets for these platforms.
And your code, however, kept as javascript code.
And you can talk to Native Platform features (like Camera), because your JS Code runs on the
special virtual machine, hosted by React Native inside of your app. And this machine knows how to
talk to the native platform features. So the operating system your app is running on through the
special "bridge". And that bridge and Virtual Machine, that's all automatically provided
by React Native. You don't have to care about this. All you do is you write you React Native App
with javascript and with these special components. That's how the React Native works behind
the scenes.

**Slide 9**: React Native Apps are really hard work! This is not about writing Javascript code once
and running it everywhere, it's instead about learning React Native once and write code that is
flexible regarding the platform it's running on. So to sum it up:
1. you have no or very little cross-platform styling of components.
Most of components that are built onto React Native don't come with a lot of styling attached to
them. You have to take care of styling instead.
2. also you have only a basic set of pre-built components. You have basic components which you need
and then all components that are a little bit complex - you have to build on your own based on these
primitives that React Native gives you. You need to combine them manually and to style them manually.
3. For creative responsive designs that looks good on different device sizes or their orientations
you don't really have tools that would help you with that.
So there is a lot of manual work to be done by you.
But it also gives you a lot of power to create amazing React Native Applications.

**Slide 10**: To sum it up... React is a JS library for creating UIs.
React is agnostic. React-DOM is used to render in the browser (Web app).
React Native is a library that can compile React components into native components/widgets.
React Native allows us to use React to create native iOS & Android applications.
React Native gives you a lot of power to create real native applications,
but it comes with a little bit of pre-built components, that you have to style & code on your own.

**Slide 11**: Thanks to everybody! Nice to see you there! Hope you enjoy!
