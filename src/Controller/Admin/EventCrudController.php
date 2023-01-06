<?php

namespace App\Controller\Admin;

use App\Entity\Event;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;

class EventCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Event::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->onlyOnIndex(),
            TextField::new('title', 'Titre'),
            TextEditorField::new('description', 'Description'),
            IntegerField::new('price', 'Prix (€)'),
            ImageField::new('cover', 'Affiche')
                ->setBasePath('events/')
                ->setUploadDir('public/events')
                ->setUploadedFileNamePattern('[randomhash].[extension]'),
            AssociationField::new('location', 'Lieux')
                ->setCrudController(LocationCrudController::class),
            AssociationField::new('category', 'Catégorie')
                ->setCrudController(CategoryCrudController::class),
            ArrayField::new('casting', 'Casting'),
            DateTimeField::new('date', 'Date')
        ];
    }
}
