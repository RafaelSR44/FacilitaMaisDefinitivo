import 'package:flutter/material.dart';
import 'screens/auth_screen.dart';
import 'styles/text_styles.dart';
import 'widgets/custom_drawer.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const AuthScreen(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const CustomDrawer(),
      body: Container(
        width: 430,
        height: 932,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 160),
        decoration: BoxDecoration(color: const Color(0xFFFFC629)),
        child: Stack(
          children: [
            // Ícone do menu (3 barras) no canto superior direito
            Positioned(
              right: 0,
              top: 0,
              child: Builder(
                builder: (context) => GestureDetector(
                  onTap: () {
                    Scaffold.of(context).openDrawer();
                  },
                  child: Container(
                    width: 40,
                    height: 40,
                    padding: const EdgeInsets.all(12),
                    clipBehavior: Clip.antiAlias,
                    decoration: ShapeDecoration(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(32),
                      ),
                    ),
                    child: const Icon(
                      Icons.menu,
                      size: 16,
                      color: Colors.black,
                    ),
                  ),
                ),
              ),
            ),
            Container(
              width: 261.25,
              height: 80,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage("https://placehold.co/261x80"),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Container(
              width: 275,
              height: 40,
              decoration: ShapeDecoration(
                color: const Color(0xFF2C2C2C),
                shape: RoundedRectangleBorder(
                  side: BorderSide(
                    width: 1,
                    color: const Color(0xFF2C2C2C),
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Stack(
                children: [
                  Positioned(
                    left: 90.50,
                    top: 12,
                    child: Text(
                      'Cadastre-se',
                      style: AppTextStyles.buttonPrimary,
                    ),
                  ),
                ],
              ),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 275,
                  height: 40,
                  padding: const EdgeInsets.all(12),
                  clipBehavior: Clip.antiAlias,
                  decoration: ShapeDecoration(
                    color: const Color(0xFFE3E3E3),
                    shape: RoundedRectangleBorder(
                      side: BorderSide(
                        width: 1,
                        color: const Color(0xFF767676),
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        'Log In',
                        style: AppTextStyles.buttonSecondary,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
