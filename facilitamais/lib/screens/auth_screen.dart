import 'package:flutter/material.dart';
import '../styles/text_styles.dart';
import '../widgets/custom_drawer.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const CustomDrawer(),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(color: Color(0xFFFFC629)),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                // Header com ícone do menu
                Container(
                  width: double.infinity,
                  height: 60,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Builder(
                        builder: (context) => GestureDetector(
                          onTap: () {
                            Scaffold.of(context).openDrawer();
                          },
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: ShapeDecoration(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(32),
                              ),
                            ),
                            child: const Icon(
                              Icons.menu,
                              size: 24,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Espaçamento para centralizar o conteúdo
                const Expanded(
                  flex: 2,
                  child: SizedBox(),
                ),
                
                // Logo/Imagem
                Container(
                  width: 261.25,
                  height: 80,
                  margin: const EdgeInsets.only(bottom: 60),
                  decoration: const BoxDecoration(
                    // Quando você adicionar o logo, descomente a linha abaixo e comente a NetworkImage
                    // image: DecorationImage(
                    //   image: AssetImage("assets/images/logo.png"),
                    //   fit: BoxFit.cover,
                    // ),
                    // Temporário - usando placeholder da internet
                    image: DecorationImage(
                      image: NetworkImage("https://placehold.co/261x80"),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                
                // Botão Cadastre-se
                GestureDetector(
                  onTap: () {
                    // Ação para cadastro
                    print('Botão Cadastre-se clicado');
                  },
                  child: Container(
                    width: 275,
                    height: 40,
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: ShapeDecoration(
                      color: const Color(0xFF2C2C2C),
                      shape: RoundedRectangleBorder(
                        side: const BorderSide(
                          width: 1,
                          color: Color(0xFF2C2C2C),
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Center(
                      child: Text(
                        'Cadastre-se',
                        style: AppTextStyles.buttonPrimary,
                      ),
                    ),
                  ),
                ),
                
                // Botão Log In
                GestureDetector(
                  onTap: () {
                    // Ação para login
                    print('Botão Log In clicado');
                  },
                  child: Container(
                    width: 275,
                    height: 40,
                    decoration: ShapeDecoration(
                      color: const Color(0xFFE3E3E3),
                      shape: RoundedRectangleBorder(
                        side: const BorderSide(
                          width: 1,
                          color: Color(0xFF767676),
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Center(
                      child: Text(
                        'Log In',
                        style: AppTextStyles.buttonSecondary,
                      ),
                    ),
                  ),
                ),
                
                // Espaçamento para centralizar o conteúdo
                const Expanded(
                  flex: 3,
                  child: SizedBox(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
