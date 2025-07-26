import 'dart:ui';

import 'package:flutter/material.dart';

const _defaultCardPadding = const EdgeInsets.symmetric(
  horizontal: 24.0,
  vertical: 16.0,
);

class WeaverCard extends StatelessWidget {
  const WeaverCard({
    super.key,
    this.padding,
    this.child,
  });
  final EdgeInsetsGeometry? padding;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: padding ?? _defaultCardPadding,
        child: child,
      ),
    );
  }
}

class WeaverGlassCard extends StatefulWidget {
  final Widget? child;
  final EdgeInsetsGeometry? padding;
  final Color? color;
  const WeaverGlassCard({
    super.key,
    this.child,
    this.padding,
    this.color,
  });

  @override
  State<WeaverGlassCard> createState() => _WeaverGlassCardState();
}

class _WeaverGlassCardState extends State<WeaverGlassCard> {
  @override
  Widget build(BuildContext context) {
    const blurSigma = 32.0;
    return Card(
      clipBehavior: Clip.antiAlias,
      // color: Colors.black.withAlpha(192),
      color: widget.color ?? Colors.black26,
      elevation: 2,
      child: IntrinsicHeight(
        child: Stack(
          children: [
            BackdropFilter(
              filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma), // control blur strength
              child: Container(),
            ),
            Padding(
              padding: widget.padding ?? _defaultCardPadding,
              child: widget.child,
            ),
          ],
        ),
      ),
    );
  }
}
