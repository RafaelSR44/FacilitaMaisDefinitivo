import 'package:flutter/material.dart';
import 'colors.dart';

class AppTextStyles {
  // Text Style para botão "Cadastre-se" - Text-Brand-On-Brand
  static const TextStyle buttonPrimary = TextStyle(
    color: AppColors.textBrandOnBrand, // Text-Brand-On-Brand
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: FontWeight.w400,
    height: 1,
  );

  // Text Style para botão "Log In" - Text-Default-Default
  static const TextStyle buttonSecondary = TextStyle(
    color: AppColors.textDefaultDefault, // Text-Default-Default
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: FontWeight.w400,
    height: 1,
  );

  // Text Style para títulos do menu - Text-Default-Default Bold
  static const TextStyle menuTitle = TextStyle(
    color: AppColors.textDefaultDefault, // Text-Default-Default
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: FontWeight.w700,
    height: 1.40,
  );

  // Text Style para itens do menu - Text-Default-Default Regular
  static const TextStyle menuItem = TextStyle(
    color: AppColors.textDefaultDefault, // Text-Default-Default
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: FontWeight.w400,
    height: 1.40,
  );
}
