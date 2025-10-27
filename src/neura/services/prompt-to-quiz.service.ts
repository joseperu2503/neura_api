import { Injectable } from '@nestjs/common';
import { QuestionParams } from 'src/common/intefaces/question-params';
import { GeminiService } from 'src/gemini/services/gemini.service';

@Injectable()
export class PromptToQuizService {
  constructor(private geminiService: GeminiService) {}

  public async generateQuiz(prompt: string) {
    return [
      {
        question: '¿Cuál de las siguientes NO es un tipo de instancia EC2?',
        options: [
          'Instancias de propósito general',
          'Instancias optimizadas para computación',
          'Instancias optimizadas para memoria',
          'Instancias optimizadas para almacenamiento',
          'Instancias optimizadas para videojuegos',
        ],
        correct: 4,
      },
      {
        question:
          '¿Qué servicio de AWS te permite ejecutar contenedores sin tener que administrar servidores?',
        options: ['Amazon EC2', 'Amazon ECS', 'AWS Lambda', 'Amazon S3'],
        correct: 1,
      },
      {
        question:
          '¿Qué debes usar para controlar el tráfico que entra y sale de tus instancias EC2?',
        options: [
          'Grupos de Seguridad',
          'Listas de Control de Acceso (ACLs)',
          'Firewall de Windows',
          'AWS Shield',
        ],
        correct: 0,
      },
      {
        question:
          '¿Cuál es la forma más rentable de ejecutar cargas de trabajo EC2 sin interrupciones en el largo plazo?',
        options: [
          'Instancias bajo demanda',
          'Instancias reservadas',
          'Instancias spot',
          'Instancias dedicadas',
        ],
        correct: 1,
      },
      {
        question:
          '¿Cuál es el precio de las instancias reservadas que requiere el mayor pago por adelantado?',
        options: [
          'Instancias reservadas estándar',
          'Instancias reservadas convertibles',
          'Instancias reservadas programadas',
          'Instancias reservadas de capacidad',
        ],
        correct: 3,
      },
      {
        question:
          'Cuando se lanza una instancia EC2 en una VPC personalizada, ¿cómo se puede asegurar que la instancia tenga conectividad a Internet?',
        options: [
          'Asignando una dirección IP elástica a la instancia.',
          'Asignando un grupo de seguridad que permita todo el tráfico de entrada y salida.',
          'Configurando una puerta de enlace de Internet (Internet Gateway) y una tabla de enrutamiento asociada.',
          'Habilitando el servicio de AWS Direct Connect.',
        ],
        correct: 2,
      },
      {
        question:
          '¿Cuál es el método recomendado para almacenar datos que necesitan persistir incluso después de que una instancia EC2 se termine?',
        options: [
          'Almacenar los datos directamente en el almacenamiento de instancia.',
          'Almacenar los datos en un volumen EBS.',
          'Almacenar los datos en la memoria RAM de la instancia.',
          'Almacenar los datos en la caché del CPU.',
        ],
        correct: 1,
      },
      {
        question:
          '¿Cuál de los siguientes es un caso de uso común para las instancias EC2 Spot?',
        options: [
          'Ejecutar bases de datos críticas para el negocio que requieren alta disponibilidad.',
          'Procesar trabajos por lotes tolerantes a fallas.',
          'Alojar sitios web con altos requisitos de rendimiento.',
          'Ejecutar aplicaciones de baja latencia en tiempo real.',
        ],
        correct: 1,
      },
    ];
    //  return this.geminiService.generateQuiz(prompt);
  }

  public async *explainAnswer(
    question: QuestionParams,
    answer: number,
  ): AsyncGenerator<string> {
    const stream = this.geminiService.explainAnswer(question, answer);

    let assistantMessage = '';

    for await (const chunk of stream) {
      yield chunk;
      assistantMessage += chunk;
    }
  }
}
