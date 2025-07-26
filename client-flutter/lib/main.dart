import 'package:flutter/material.dart';
import 'package:weaver/widgets/weaver_card.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Weaver',
      darkTheme: ThemeData.dark(),
      home: const Weaver(title: 'Weaver'),
      debugShowCheckedModeBanner: false,
    );
  }
}

class Weaver extends StatefulWidget {
  const Weaver({super.key, required this.title});

  final String title;

  @override
  State<Weaver> createState() => _WeaverState();
}

final items = <String>[];

class _WeaverState extends State<Weaver> {
  @override
  Widget build(BuildContext context) {
    for (var i = 0; i < 100; i++) {
      items.add('Test $i');
    }

    return Scaffold(
      body: LayoutBuilder(builder: (context, constraints) {
        return SizedBox(
          height: constraints.maxHeight,
          child: Row(
            mainAxisSize: MainAxisSize.max,
            children: [
              Expanded(
                child: SizedBox(
                  height: constraints.maxHeight,
                  child: WeaverGlassCard(
                    child: ListView.builder(
                      itemCount: items.length,
                      itemBuilder: (context, index) {
                        final item = items[index];
                        return Text(item);
                      },
                    ),
                  ),
                ),
              ),
              Expanded(
                child: WeaverCard(),
              ),
              Expanded(
                child: WeaverCard(),
              ),
              Expanded(
                child: WeaverCard(),
              ),
            ],
          ),
        );
      }),
    );
  }
}
