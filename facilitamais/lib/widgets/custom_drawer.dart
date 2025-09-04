import 'package:flutter/material.dart';
import '../styles/colors.dart';
import '../styles/text_styles.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      width: 375,
      child: Container(
        width: 375,
        padding: const EdgeInsets.all(32),
        clipBehavior: Clip.antiAlias,
        decoration: ShapeDecoration(
          color: AppColors.backgroundDefaultDefault,
          shape: RoundedRectangleBorder(
            side: BorderSide(
              width: 1,
              color: AppColors.borderDefaultDefault,
            ),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header com ícones
            ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 240),
              child: SizedBox(
                width: double.infinity,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [],
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Container(
                            width: 23.98,
                            height: 24,
                            child: const Icon(Icons.close, size: 24),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Container(
                          width: 24,
                          height: 24,
                          clipBehavior: Clip.antiAlias,
                          decoration: const BoxDecoration(),
                          child: const Icon(Icons.share, size: 24),
                        ),
                        const SizedBox(width: 16),
                        Container(
                          width: 24,
                          height: 24,
                          clipBehavior: Clip.antiAlias,
                          decoration: const BoxDecoration(),
                          child: const Icon(Icons.bookmark, size: 24),
                        ),
                        const SizedBox(width: 16),
                        Container(
                          width: 24,
                          height: 24,
                          clipBehavior: Clip.antiAlias,
                          decoration: const BoxDecoration(),
                          child: const Icon(Icons.more_vert, size: 24),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 64),
            // Conteúdo do menu
            SizedBox(
              width: double.infinity,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Seção Use cases
                  _buildMenuSection(
                    title: 'Use cases',
                    items: [
                      'UI design',
                      'UX design',
                      'Wireframing',
                      'Diagramming',
                      'Brainstorming',
                      'Online whiteboard',
                      'Team collaboration',
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Seção Explore
                  _buildMenuSection(
                    title: 'Explore',
                    items: [
                      'Design',
                      'Prototyping',
                      'Development features',
                      'Design systems',
                      'Collaboration features',
                      'Design process',
                      'FigJam',
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Seção Resources
                  _buildMenuSection(
                    title: 'Resources',
                    items: [
                      'Blog',
                      'Best practices',
                      'Colors',
                      'Color wheel',
                      'Support',
                      'Developers',
                      'Resource library',
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuSection({required String title, required List<String> items}) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Título da seção
          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(bottom: 4),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: double.infinity,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: AppTextStyles.menuTitle,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          // Itens da seção
          ...items.map((item) => Container(
            width: double.infinity,
            height: 22,
            margin: const EdgeInsets.only(bottom: 8),
            child: Stack(
              children: [
                Positioned(
                  left: 0,
                  top: 0,
                  child: Builder(
                    builder: (context) => GestureDetector(
                      onTap: () {
                        // Aqui você pode adicionar a navegação para cada item
                        Navigator.pop(context);
                      },
                      child: Text(
                        item,
                        style: AppTextStyles.menuItem,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          )).toList(),
        ],
      ),
    );
  }
}
